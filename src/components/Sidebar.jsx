// src/components/Sidebar.jsx
import {
  Box, Flex, Text, VStack, IconButton, Avatar, Badge, useColorMode, useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  FaHome, FaUsers, FaCog, FaSignOutAlt, FaFileContract, FaMoneyBillWave,
  FaCalendarAlt, FaEdit, FaCalendarCheck, FaUserCircle, FaCodeBranch, FaChalkboardTeacher
} from 'react-icons/fa';

export const triggerSidebarRefresh = () => {
  window.dispatchEvent(new Event('sidebar-refresh'));
};

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('teal.50', 'teal.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('teal', 'teal.300');
  const textColor = useColorModeValue('gray.800', 'white');

  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || 'null'), []);
  const userRole = user?.role || 'staff';

  const API_BASE = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'https://ayateke-backend.onrender.com';

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingLeaves: 0,
    myPendingLeaves: 0,
    trainings: 0,
    todayAttendance: 0,
  });

  const safeJson = async (res) => {
    try { return await res.json(); } catch { return null; }
  };

  const fetchAdminStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const [usersRes, leavesRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/users`),
      fetch(`${API_BASE}/api/leaves`),
    ]);

    let users = [];
    let leaves = [];

    if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
      const data = await safeJson(usersRes.value);
      users = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    }

    if (leavesRes.status === 'fulfilled' && leavesRes.value.ok) {
      const data = await safeJson(leavesRes.value);
      leaves = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    }

    let todayAttendanceCount = 0;
    try {
      const tRes = await fetch(`${API_BASE}/api/attendance/today`);
      if (tRes.ok) {
        const t = await safeJson(tRes);
        todayAttendanceCount = Array.isArray(t) ? t.length : 0;
      } else if (tRes.status === 404) {
        const qRes = await fetch(`${API_BASE}/api/attendance?date=${today}`);
        if (qRes.ok) {
          const q = await safeJson(qRes);
          todayAttendanceCount = Array.isArray(q) ? q.length : 0;
        }
      }
    } catch { /* ignore */ }

    setStats((s) => ({
      ...s,
      totalUsers: users.length,
      pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
      trainings: s.trainings || 5,
      todayAttendance: todayAttendanceCount,
    }));
  };

  const fetchStaffStats = async () => {
    let myPending = 0;
    try {
      const res = await fetch(`${API_BASE}/api/leaves`);
      if (res.ok) {
        const data = await safeJson(res);
        const leaves = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        myPending = leaves.filter((l) => l.employee_id === user?.email && l.status === 'pending').length;
      }
    } catch { /* ignore */ }

    let myToday = 0;
    try {
      const res = await fetch(`${API_BASE}/api/attendance/today`);
      if (res.ok) {
        const t = await safeJson(res);
        myToday = (Array.isArray(t) ? t : []).filter((r) => r.employee_id === user?.email).length;
      }
    } catch { /* ignore */ }

    setStats((s) => ({
      ...s,
      myPendingLeaves: myPending,
      trainings: s.trainings || 3,
      todayAttendance: myToday || s.todayAttendance,
    }));
  };

  const load = useCallback(async () => {
    if (userRole === 'admin') await fetchAdminStats();
    else await fetchStaffStats();
  }, [userRole, user?.email, API_BASE]);

  useEffect(() => {
    load();

    const handleRefresh = () => load();
    window.addEventListener('sidebar-refresh', handleRefresh);

    const interval = setInterval(load, 15000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sidebar-refresh', handleRefresh);
    };
  }, [load]);

  const adminNav = [
    { label: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { label: 'Career Growth', icon: FaChalkboardTeacher, path: '/admin/training', badge: stats.trainings },
    // { label: 'Staff Directory', icon: FaUsers, path: '/admin/staff', badge: stats.totalUsers },
    { label: 'Branches', icon: FaCodeBranch, path: '/admin/branches' },
    // { label: 'Contracts', icon: FaFileContract, path: '/admin/contracts' },
    // { label: 'Payroll', icon: FaMoneyBillWave, path: '/admin/payroll' },
    { label: 'Leave Requests', icon: FaCalendarAlt, path: '/admin/leave-dashboard', badge: stats.pendingLeaves },
    // { label: 'Attendance', icon: FaCalendarCheck, path: '/admin/attendance', badge: stats.todayAttendance },
    { label: 'Settings', icon: FaCog, path: '/admin/settings' },
  ];

  const staffNav = [
    { label: 'Dashboard', icon: FaHome, path: '/staff' },
    { label: 'Career Growth', icon: FaChalkboardTeacher, path: '/staff/training', badge: stats.trainings },
    { label: 'Submit Leave', icon: FaEdit, path: '/staff/leave-request' },
    { label: 'My Leave History', icon: FaCalendarCheck, path: '/staff/leaves', badge: stats.myPendingLeaves },
    { label: 'Profile', icon: FaUserCircle, path: '/staff/profile' },
  ];

  const visibleItems = userRole === 'admin' ? adminNav : staffNav;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleItemClick = () => {
    if (onClose) onClose();
  };

  return (
    <Box w={{ base: 'full', md: '250px' }} bg={bg} p={5} shadow="md" height="100vh" position="sticky" top="0" zIndex="10">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color="teal.600">Ayateke HR</Text>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          variant="ghost"
          aria-label="Toggle theme"
          title="Toggle theme"
        />
      </Flex>

      <Flex align="center" gap={3} mb={6}>
        <Avatar size="sm" name={user?.name || 'User'} />
        <Box>
          <Text fontWeight="medium" color={textColor}>{user?.name || 'Staff'}</Text>
          <Text fontSize="sm" color="gray.500">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Text>
        </Box>
      </Flex>

      <VStack align="start" spacing={2}>
        {visibleItems.map((item, index) => (
          <NavLink key={index} to={item.path} onClick={handleItemClick}>
            {({ isActive }) => (
              <Flex
                align="center"
                justify="space-between"
                w="full"
                px={3}
                py={2}
                borderRadius="md"
                bg={isActive ? activeBg : 'transparent'}

                fontWeight={isActive ? 'bold' : 'normal'}
                borderLeft={isActive ? `4px solid ${borderColor}` : '4px solid transparent'}
                color={textColor}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                transition="all 0.2s ease"
              >
                <Flex align="center" gap={3}>
                  <Box as={item.icon} fontSize="lg" />
                  <Text>{item.label}</Text>
                </Flex>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <Badge colorScheme="teal" borderRadius="md" title={`${item.label} count`}>
                   {item.badge}
                  </Badge>
                )}
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      <Flex mt={8} pt={4} borderTop="1px solid" borderColor={hoverBg} align="center" justify="space-between">
        <Text fontSize="sm" color="gray.500">Signed in</Text>
        <IconButton
          icon={<FaSignOutAlt />}
          onClick={handleLogout}
          size="sm"
          variant="outline"
          aria-label="Logout"
        />
      </Flex>
    </Box>
  );
};

export default Sidebar;

import {
  Box,
  Flex,
  Text,
  VStack,
  IconButton,
  Avatar,
  Divider,
  Badge,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  FaHome,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaEdit,
  FaCalendarCheck,
  FaUserCircle,
} from 'react-icons/fa';

const Sidebar = ({ currentPath, onClose }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('teal.50', 'teal.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('teal', 'teal.300');
  const textColor = useColorModeValue('gray.800', 'white');

  const user = useMemo(
    () => JSON.parse(localStorage.getItem('user') || 'null'),
    []
  );
  const userRole = user?.role || 'staff';

  const API_BASE =
    process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingLeaves: 0,
    myPendingLeaves: 0,
    trainings: 0,
    todayAttendance: 0,
  });

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const fetchAdminStats = async () => {
    const [usersRes, leavesRes, attendanceRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/users`),
      fetch(`${API_BASE}/api/leaves`),
      fetch(`${API_BASE}/api/attendance/today`),
    ]);

    let users = [];
    let leaves = [];
    let attendance = [];

    if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
      const data = await safeJson(usersRes.value);
      users = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    }

    if (leavesRes.status === 'fulfilled' && leavesRes.value.ok) {
      const data = await safeJson(leavesRes.value);
      leaves = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    }

    if (attendanceRes.status === 'fulfilled' && attendanceRes.value.ok) {
      const data = await safeJson(attendanceRes.value);
      attendance = Array.isArray(data) ? data : [];
    }

    setStats((s) => ({
      ...s,
      totalUsers: users.length,
      pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
      trainings: s.trainings || 5,
      todayAttendance: attendance.length,
    }));
  };

  const fetchStaffStats = async () => {
    const leavesRes = await fetch(`${API_BASE}/api/leaves`).catch(() => null);
    let leaves = [];
    if (leavesRes?.ok) {
      const data = await safeJson(leavesRes);
      leaves = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    }

    const myLeaves = leaves.filter((l) => l.employee_id === user?.email);

    setStats((s) => ({
      ...s,
      myPendingLeaves: myLeaves.filter((l) => l.status === 'pending').length,
      trainings: s.trainings || 3,
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (userRole === 'admin') await fetchAdminStats();
        else await fetchStaffStats();
      } catch {
        // ignore errors
      }
    };

    load();

    const interval = setInterval(() => {
      if (isMounted) load();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userRole, user?.email, API_BASE]);

  const adminNav = [
    { label: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { label: 'Staff Directory', icon: FaUsers, path: '/admin/staff', badge: stats.totalUsers },
    { label: 'Contracts', icon: FaFileContract, path: '/admin/contracts' },
    { label: 'Payroll', icon: FaMoneyBillWave, path: '/admin/payroll' },
    { label: 'Leave Requests', icon: FaCalendarAlt, path: '/admin/leaves', badge: stats.pendingLeaves },
    { label: 'Attendance', icon: FaCalendarCheck, path: '/admin/attendance', badge: stats.todayAttendance },
    { label: 'Training', icon: FaUsers, path: '/admin/training', badge: stats.trainings },
    { label: 'Settings', icon: FaCog, path: '/admin/settings' },
  ];

  const staffNav = [
    { label: 'Dashboard', icon: FaHome, path: '/staff' },
    { label: 'Submit Leave', icon: FaEdit, path: '/staff/leave-request' },
    { label: 'My Leave History', icon: FaCalendarCheck, path: '/staff/leaves', badge: stats.myPendingLeaves },
    { label: 'Training', icon: FaUsers, path: '/staff/training', badge: stats.trainings },
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
    <Box
      w={{ base: 'full', md: '250px' }}
      bg={bg}
      p={5}
      shadow="md"
      height="100vh"
      position="sticky"
      top="0"
      zIndex="10"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color="teal.600">
          Ayateke HR
        </Text>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          variant="ghost"
          aria-label="Toggle theme"
        />
      </Flex>

      {/* User Info */}
      <Flex align="center" gap={3} mb={6}>
        <Avatar size="sm" name={user?.name || 'User'} />
        <Box>
          <Text fontWeight="medium" color={textColor}>
            {user?.name || 'Staff'}
          </Text>
          <Text fontSize="sm" color="gray.500

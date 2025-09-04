import {
  Box,
  Flex,
  Text,
  VStack,
  IconButton,
  Avatar,
  Divider,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons';
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
  FaFileAlt,
  FaMoneyCheckAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('teal.100', 'teal.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('teal.500', 'teal.300');
  const textColor = useColorModeValue('gray.800', 'white');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = user?.role || 'staff';

  const adminNav = [
    { label: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { label: 'Staff Directory', icon: FaUsers, path: '/admin/staff' },
    { label: 'Contracts', icon: FaFileContract, path: '/admin/contracts' },
    { label: 'Payroll', icon: FaMoneyBillWave, path: '/admin/payroll' },
    { label: 'Leave Requests', icon: FaCalendarAlt, path: '/admin/leaves' },
    { label: 'Settings', icon: FaCog, path: '/admin/settings' },
  ];

  const staffNav = [
    { label: 'Dashboard', icon: FaHome, path: '/staff' },
    { label: 'Submit Leave', icon: FaEdit, path: '/staff/leave-request' },
    { label: 'My Leave History', icon: FaCalendarCheck, path: '/staff/leaves' },
    { label: 'My Contract', icon: FaFileAlt, path: '/staff/contract' },
    { label: 'My Payslip', icon: FaMoneyCheckAlt, path: '/staff/payslip' },
  ];

  const visibleItems = userRole === 'admin' ? adminNav : staffNav;

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
          <Text fontSize="sm" color="gray.500">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Text>
        </Box>
      </Flex>

      {/* Navigation */}
      <VStack align="start" spacing={2}>
        {visibleItems.map((item, index) => (
          <NavLink key={index} to={item.path}>
            {({ isActive }) => (
              <Flex
                align="center"
                gap={3}
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
                <Box as={item.icon} fontSize="lg" />
                <Text>{item.label}</Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      <Divider my={6} />

      {/* Logout */}
      <Flex
        px={3}
        py={2}
        borderRadius="md"
        color={textColor}
        _hover={{ bg: hoverBg, cursor: 'pointer' }}
        transition="all 0.2s ease"
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        <Box as={FaSignOutAlt} fontSize="lg" />
        <Text ml={3}>Logout</Text>
      </Flex>
    </Box>
  );
};

export default Sidebar;

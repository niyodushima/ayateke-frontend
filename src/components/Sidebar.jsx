import {
  Box,
  Flex,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const navItems = [
  { label: 'Dashboard', emoji: '🏠', path: '/admin/dashboard', roles: ['admin', 'hr', 'staff'] },
  { label: 'Staff Directory', emoji: '👥', path: '/admin/staff', roles: ['admin', 'hr'] },
  { label: 'Settings', emoji: '⚙️', path: '/admin/settings', roles: ['admin'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  // ✅ Hooks must be called at top level
  const bg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('teal.50', 'teal.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('teal', 'teal.300');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = user?.role || 'staff';

  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

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
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                transition="all 0.2s ease"
              >
                <Text fontSize="lg">{item.emoji}</Text>
                <Text>{item.label}</Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      <Divider my={6} />
      <Flex
        px={3}
        py={2}
        borderRadius="md"
        _hover={{ bg: hoverBg, cursor: 'pointer' }}
        transition="all 0.2s ease"
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        <Text fontSize="lg">🚪</Text>
        <Text ml={3}>Logout</Text>
      </Flex>
    </Box>
  );
};

export default Sidebar;

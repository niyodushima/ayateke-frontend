import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const userRole = 'hr'; // Replace with dynamic role later

const navItems = [
  { label: 'Dashboard', emoji: '🏠', path: '/admin/dashboard', roles: ['admin', 'hr', 'staff'] },
  { label: 'Staff Directory', emoji: '👥', path: '/admin/staff', roles: ['admin', 'hr'] },
  { label: 'Settings', emoji: '⚙️', path: '/admin/settings', roles: ['admin'] },
];

const Sidebar = () => {
  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <Box w="250px" bg="white" p={5} shadow="md" height="100vh">
      <Text fontSize="xl" fontWeight="bold" mb={6} color="teal.600">
        Ayateke HR
      </Text>

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
                bg={isActive ? 'teal.50' : 'transparent'}
                fontWeight={isActive ? 'bold' : 'normal'}
                borderLeft={isActive ? '4px solid teal' : '4px solid transparent'}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                transition="all 0.2s ease"
              >
                <Text fontSize="lg">{item.emoji}</Text>
                <Text>{item.label}</Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;

import {
  Flex,
  Spacer,
  Avatar,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

const Navbar = ({ onOpenSidebar }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Flex bg={bg} p={4} shadow="sm" align="center" borderBottom="1px solid" borderColor="gray.200">
      {/* Hamburger for mobile */}
      <IconButton
        icon={<HamburgerIcon />}
        display={{ base: 'inline-flex', md: 'none' }}
        onClick={onOpenSidebar}
        aria-label="Open menu"
        mr={4}
      />

      <Text fontWeight="bold" fontSize="lg" color={textColor}>
        {user?.role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}
      </Text>
      <Spacer />

      <Menu>
        <MenuButton>
          <Avatar name={user?.name || 'User'} />
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Navbar;

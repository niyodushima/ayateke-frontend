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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

const Navbar = ({ onOpenSidebar }) => (
  <Flex bg="white" p={4} shadow="sm" align="center">
    {/* Hamburger for mobile */}
    <IconButton
      icon={<HamburgerIcon />}
      display={{ base: 'inline-flex', md: 'none' }}
      onClick={onOpenSidebar}
      aria-label="Open menu"
      mr={4}
    />

    <Text fontWeight="bold">Dashboard</Text>
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

export default Navbar;

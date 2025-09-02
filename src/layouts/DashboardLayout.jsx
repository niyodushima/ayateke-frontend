import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Sidebar for desktop */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>

      {/* Drawer for mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <Sidebar />
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box flex="1" display="flex" flexDirection="column" bg="gray.50">
        <Navbar onOpenSidebar={onOpen} />
        <Box flex="1" overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;

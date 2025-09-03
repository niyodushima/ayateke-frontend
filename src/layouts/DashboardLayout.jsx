import {
  Box,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
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
        <DrawerContent bg={useColorModeValue('white', 'gray.900')}>
          <DrawerCloseButton />
          <Sidebar />
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box flex="1" display="flex" flexDirection="column" bg="gray.50">
        <Box position="sticky" top="0" zIndex="20">
          <Navbar onOpenSidebar={onOpen} />
        </Box>
        <Box flex="1" overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;

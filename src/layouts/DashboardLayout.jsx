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
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  return (
    <Flex height="100vh" overflow="hidden" bg="gray.50">
      {/* Sidebar for desktop */}
      <Box
        display={{ base: 'none', md: 'block' }}
        width="250px"
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow="md"
        zIndex="10"
      >
        <Sidebar currentPath={location.pathname} />
      </Box>

      {/* Drawer for mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue('white', 'gray.900')}>
          <DrawerCloseButton />
          <Sidebar currentPath={location.pathname} onClose={onClose} />
        </DrawerContent>
      </Drawer>
 
      {/* Main content */}
      <Box flex="1" display="flex" flexDirection="column">
        <Box position="sticky" top="0" zIndex="20">
          <Navbar onOpenSidebar={onOpen} />
        </Box>
        <Box flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;

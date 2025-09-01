import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => (
  <Flex height="100vh" overflow="hidden">
    <Sidebar />
    <Box flex="1" display="flex" flexDirection="column" bg="gray.50">
      <Navbar />
      <Box flex="1" overflowY="auto" p={6}>
        <Outlet />
      </Box>
    </Box>
  </Flex>
);

export default DashboardLayout;

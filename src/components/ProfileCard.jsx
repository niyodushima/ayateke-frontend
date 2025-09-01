import { Box, VStack, Text, IconButton } from '@chakra-ui/react';
import { FiUsers, FiClock, FiFileText, FiBarChart2, FiSettings } from 'react-icons/fi';

const user = JSON.parse(localStorage.getItem('user'));

const Sidebar = () => (
  <Box w="250px" bg="white" p={5} shadow="md">
    <Text fontSize="xl" fontWeight="bold" mb={6}>Ayateke HR</Text>
    <VStack align="start" spacing={4}>
      <IconButton icon={<FiUsers />} aria-label="Staff" />
      <IconButton icon={<FiClock />} aria-label="Attendance" />
      <IconButton icon={<FiFileText />} aria-label="Leave" />
      <IconButton icon={<FiBarChart2 />} aria-label="Reports" />
      <IconButton icon={<FiSettings />} aria-label="Settings" />
    </VStack>
  </Box>
);

export default Sidebar;

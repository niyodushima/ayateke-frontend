import {
  Box,
  Heading,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ContractCard from '../components/ContractCard';
import PayslipTable from '../components/PayslipTable';

const StaffProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const name = user?.name || 'Staff';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="lg" color="teal.700">Profile: {name}</Heading>
        <Button colorScheme="gray" onClick={handleLogout}>Logout</Button>
      </Flex>

      <ContractCard />
      <PayslipTable />
    </Box>
  );
};

export default StaffProfile;

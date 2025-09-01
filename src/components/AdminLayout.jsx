import { Flex, Box } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';

const storedUser = JSON.parse(localStorage.getItem('user'));
const userRole = storedUser?.role || 'staff';

const AdminLayout = ({ children }) => {
  return (
    <Flex>
      <Sidebar userRole={userRole} />
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;

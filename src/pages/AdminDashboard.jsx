import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  useToast,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const usersRes = await fetch('http://localhost:5000/api/users');
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);

      const leavesRes = await fetch('http://localhost:5000/api/leaves');
      const leavesData = await leavesRes.json();
      const leaveArray = Array.isArray(leavesData)
        ? leavesData
        : Array.isArray(leavesData.data)
          ? leavesData.data
          : [];
      setLeaves(leaveArray);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setUsers([]);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast({ title: `Leave ${status}`, status: 'success', duration: 3000, isClosable: true });
        fetchData();
      } else {
        toast({ title: 'Failed to update status', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeaves = leaves.filter(l =>
    statusFilter === 'all' ? true : l.status === statusFilter
  );

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading admin dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="lg" color="blue.700">Admin Dashboard</Heading>
        <Button colorScheme="gray" onClick={handleLogout}>Logout</Button>
      </Flex>

      <Box mb={8} p={4} bg="white" boxShadow="md" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Registered Users</Text>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>Email</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u, i) => (
              <Tr key={i}>
                <Td>{u.email}</Td>
                <Td>{u.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box p={4} bg="white" boxShadow="md" borderRadius="md">
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
          <Text fontWeight="bold">Leave Requests</Text>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="300px"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </Flex>

        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>Employee</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLeaves.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">No leave requests found.</Td>
              </Tr>
            ) : (
              filteredLeaves.map((l, i) => (
                <Tr key={i}>
                  <Td>{l.employee_id}</Td>
                  <Td>{l.start_date}</Td>
                  <Td>{l.end_date}</Td>
                  <Td>{l.reason}</Td>
                  <Td>{l.status}</Td>
                  <Td>
                    {l.status === 'pending' && (
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => updateLeaveStatus(l.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => updateLeaveStatus(l.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Flex>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

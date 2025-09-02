import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useToast,
  Spinner,
  Text,
  Select,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();
  const navigate = useNavigate();

  const email = JSON.parse(localStorage.getItem('user') || 'null')?.email;

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves');
      const data = await res.json();

      const leaveArray = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      const filtered = leaveArray.filter(l => l.employee_id === email);
      setLeaves(filtered);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const submitLeave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, employee_id: email })
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Leave submitted', status: 'success', duration: 3000, isClosable: true });
        setForm({ start_date: '', end_date: '', reason: '' });
        fetchLeaves();
      } else {
        toast({ title: data.message || 'Error', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const cancelLeave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast({ title: 'Leave cancelled', status: 'info', duration: 3000, isClosable: true });
        fetchLeaves();
      } else {
        toast({ title: 'Failed to cancel leave', status: 'error', duration: 3000, isClosable: true });
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
    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter(l =>
    statusFilter === 'all' ? true : l.status === statusFilter
  );

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading your leave requests...</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="lg" color="teal.700">Staff Dashboard</Heading>
        <Button colorScheme="gray" onClick={handleLogout}>Logout</Button>
      </Flex>

      <Box mb={8} p={4} bg="white" boxShadow="md" borderRadius="md">
        <Text fontWeight="bold" mb={4}>Submit Leave Request</Text>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Start Date"
            value={form.start_date}
            onChange={e => setForm({ ...form, start_date: e.target.value })}
          />
          <Input
            placeholder="End Date"
            value={form.end_date}
            onChange={e => setForm({ ...form, end_date: e.target.value })}
          />
          <Input
            placeholder="Reason"
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
          />
          <Button colorScheme="teal" onClick={submitLeave}>Submit Leave</Button>
        </VStack>
      </Box>

      <Box p={4} bg="white" boxShadow="md" borderRadius="md">
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
          <Text fontWeight="bold">Your Leave Requests</Text>
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
                <Td colSpan={5} textAlign="center">No leave requests found.</Td>
              </Tr>
            ) : (
              filteredLeaves.map((l, i) => (
                <Tr key={i}>
                  <Td>{l.start_date}</Td>
                  <Td>{l.end_date}</Td>
                  <Td>{l.reason}</Td>
                  <Td>{l.status}</Td>
                  <Td>
                    {l.status === 'pending' && (
                      <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={() => cancelLeave(l.id)}
                      >
                        Cancel
                      </Button>
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

export default StaffDashboard;

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
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const email = user?.email || '';
  const name = user?.name || 'Staff';

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves');
      const data = await res.json();
      const leaveArray = Array.isArray(data) ? data : data.data || [];
      const filtered = leaveArray.filter(l => l.employee_id === email);
      setLeaves(filtered);
    } catch (err) {
      toast({ title: 'Failed to load leaves', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const submitLeave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, employee_id: email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Leave submitted', status: 'success' });
        setForm({ start_date: '', end_date: '', reason: '' });
        fetchLeaves();
      } else {
        toast({ title: data.message || 'Error submitting leave', status: 'error' });
      }
    } catch {
      toast({ title: 'Server error', status: 'error' });
    }
  };

  const cancelLeave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Leave cancelled', status: 'info' });
        fetchLeaves();
      } else {
        toast({ title: 'Failed to cancel leave', status: 'error' });
      }
    } catch {
      toast({ title: 'Server error', status: 'error' });
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter(l =>
    statusFilter === 'all' ? true : l.status === statusFilter
  );

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const lastLeave = leaves[leaves.length - 1];

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
        <Heading size="lg" color="teal.700">Welcome, {name}</Heading>
        <Button variant="outline" colorScheme="red" onClick={() => { localStorage.clear(); navigate('/'); }}>
          Logout
        </Button>
      </Flex>

      {/* Quick Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
          <CardBody>
            <Stat>
              <StatLabel>Pending Requests</StatLabel>
              <StatNumber>{pendingCount}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
          <CardBody>
            <Stat>
              <StatLabel>Approved Leaves</StatLabel>
              <StatNumber>{approvedCount}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}>
          <CardBody>
            <Stat>
              <StatLabel>Last Request Status</StatLabel>
              <StatNumber>{lastLeave?.status || 'N/A'}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Divider mb={6} />

      {/* Leave Request Form */}
      <Box mb={8} p={6} bg="white" boxShadow="md" borderRadius="md">
        <Text fontWeight="bold" mb={4}>Submit Leave Request</Text>
        <VStack spacing={4} align="stretch">
          <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
          <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
          <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <Button colorScheme="teal" onClick={submitLeave}>Submit Leave</Button>
        </VStack>
      </Box>

      {/* Leave History Table */}
      <Box p={6} bg="white" boxShadow="md" borderRadius="md" overflowX="auto">
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
          <Text fontWeight="bold">Your Leave History</Text>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} maxW="300px">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </Flex>

        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
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
                  <Td>
                    <Badge colorScheme={l.status === 'approved' ? 'green' : l.status === 'pending' ? 'orange' : 'red'}>
                      {l.status}
                    </Badge>
                  </Td>
                  <Td>
                    {l.status === 'pending' && (
                      <Button size="sm" colorScheme="orange" onClick={() => cancelLeave(l.id)}>
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

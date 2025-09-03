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

  const email = JSON.parse(localStorage.getItem('user') || 'null')?.email;

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leaves');
      const data = await res.json();
      const leaveArray = Array.isArray(data) ? data : data.data || [];
      const filtered = leaveArray.filter(l => l.employee_id === email);
      setLeaves(filtered);
    } catch (err) {
      console.error('Error fetching leaves:', err);
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
    } catch (err) {
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
    } catch (err) {
      toast({ title: 'Server error', status: 'error' });
    }
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
        <Button colorScheme="gray" onClick={() => { localStorage.clear(); navigate('/'); }}>
          Logout
        </Button>
      </Flex>

      <Box mb={8} p={4} bg="white" boxShadow="md" borderRadius="md">
        <Text fontWeight="bold" mb={4}>Submit Leave Request</Text>
        <VStack spacing={4} align="stretch">
          <Input
            type="date"
            value={form.start_date}
            onChange={e => setForm({ ...form, start_date: e.target.value })}
          />
          <Input
            type="date"
            value={form.end_date}
            onChange={e => setForm({ ...form, end_date: e.target.value })}
          />
          <Input
            placeholder="Reason"
            value={form.reason}
            onChange

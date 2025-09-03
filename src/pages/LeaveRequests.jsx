import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Spinner,
  Text,
  useToast,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = user?.role || 'staff';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/leaves`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch leave requests:', err);
        toast({
          title: 'Error loading leave requests.',
          description: err.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const confirm = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this request?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${BASE_URL}/api/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
        );
        toast({
          title: `Leave ${newStatus.toLowerCase()} successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to update status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Box p={6} bg={cardBg} rounded="md" shadow="md">
      <Heading mb={4}>Leave Requests</Heading>

      {loading ? (
        <Center py={10}>
          <Spinner size="lg" />
        </Center>
      ) : requests.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No leave requests found.
        </Text>
      ) : (
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th>Employee</Th>
              <Th>Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Status</Th>
              {['admin', 'hr'].includes(userRole) && <Th>Action</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((req) => (
              <Tr key={req.id}>
                <Td>{req.employee_name || req.employee || 'Unknown'}</Td>
                <Td>{req.type}</Td>
                <Td>{req.start_date}</Td>
                <Td>{req.end_date}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      req.status === 'Approved'
                        ? 'green'
                        : req.status === 'Rejected'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {req.status}
                  </Badge>
                </Td>
                {['admin', 'hr'].includes(userRole) && (
                  <Td>
                    {req.status === 'Pending' && (
                      <>
                        <Button
                          size="xs"
                          colorScheme="green"
                          mr={2}
                          onClick={() => updateStatus(req.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => updateStatus(req.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default LeaveRequests;

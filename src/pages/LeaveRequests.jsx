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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// ✅ Use environment variable for backend URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/leaves`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

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
    <Box p={6}>
      <Heading mb={4}>Leave Requests</Heading>
      {loading ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <Text>No leave requests found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Employee</Th>
              <Th>Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Status</Th>
              <Th>Action</Th>
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
                <Td>
                  {req.status === 'Pending' && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() => updateStatus(req.id, 'Approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => updateStatus(req.id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default LeaveRequests;

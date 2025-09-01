import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StaffTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/staff')
      .then(res => {
        setStaff(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching staff:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Department</Th>
          </Tr>
        </Thead>
        <Tbody>
          {staff.map((person) => (
            <Tr key={person.id}>
              <Td>{person.name}</Td>
              <Td>{person.role}</Td>
              <Td>{person.department}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {staff.length === 0 && (
        <Text mt={4} color="gray.500" textAlign="center">
          No staff records available.
        </Text>
      )}
    </Box>
  );
};

export default StaffTable;

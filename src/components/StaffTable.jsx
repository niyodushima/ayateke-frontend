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
  Badge,
  Avatar,
  Flex,
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
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading staff directory...</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto" bg="white" p={4} rounded="md" shadow="md">
      <Text fontWeight="bold" mb={4}>Staff Directory</Text>
      <Table variant="striped" colorScheme="gray" size="sm">
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
              <Td>
                <Flex align="center" gap={3}>
                  <Avatar size="sm" name={person.name} />
                  <Text>{person.name}</Text>
                </Flex>
              </Td>
              <Td>
                <Badge colorScheme="teal">{person.role}</Badge>
              </Td>
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

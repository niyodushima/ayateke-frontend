import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Text, Spinner, Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/salaries')
      .then(res => {
        setSalaries(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching salaries:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <Box overflowX="auto" mt={10}>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Staff</Th>
            <Th>Month</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {salaries.map((salary) => (
            <Tr key={salary.id}>
              <Td>{salary.name}</Td>
              <Td>{salary.month}</Td>
              <Td>${salary.amount}</Td>
              <Td>
                <Badge colorScheme={salary.status === 'Paid' ? 'green' : 'orange'}>
                  {salary.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {salaries.length === 0 && (
        <Text mt={4} color="gray.500" textAlign="center">
          No salary records available.
        </Text>
      )}
    </Box>
  );
};

export default SalaryTable;

import { Table, Thead, Tbody, Tr, Th, Td, Badge, Box, Heading } from '@chakra-ui/react';


const staffList = [
  { id: 1, name: 'Chance Mukiza Doe', department: 'Finance', status: 'Active' },
  { id: 2, name: 'Nadine Ishimwe', department: 'IT', status: 'Inactive' },
  { id: 3, name: 'Alice Mugenzi', department: 'HR', status: 'Active' },
  { id: 4, name: 'Eric Niyonkuru', department: 'Operations', status: 'Inactive' },
];

const StaffDirectory = () => (
  <Box bg="white" p={6} rounded="md" shadow="md">
    <Heading size="md" mb={4}>Staff Directory</Heading>
    <Table variant="simple">
      <Thead bg="gray.100">
        <Tr>
          <Th>Name</Th>
          <Th>Department</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {staffList.map((staff) => (
          <Tr key={staff.id}>
            <Td>{staff.name}</Td>
            <Td>{staff.department}</Td>
            <Td>
              <Badge colorScheme={staff.status === 'Active' ? 'green' : 'red'}>
                {staff.status}
              </Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default StaffDirectory;

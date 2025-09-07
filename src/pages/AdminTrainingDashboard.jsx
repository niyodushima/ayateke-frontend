import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  VStack,
} from '@chakra-ui/react';

const AdminTrainingDashboard = () => {
  // 🔧 Mock training data
  const trainingData = [
    {
      employee: 'nadine@ayateke.com',
      department: 'Engineering',
      trainings: [
        { title: 'Workplace Safety', completed: true },
        { title: 'Data Privacy', completed: false },
      ],
    },
    {
      employee: 'alice@ayateke.com',
      department: 'Finance',
      trainings: [
        { title: 'Workplace Safety', completed: true },
        { title: 'Customer Service', completed: true },
      ],
    },
    {
      employee: 'john@ayateke.com',
      department: 'Operations',
      trainings: [
        { title: 'Workplace Safety', completed: false },
        { title: 'Data Privacy', completed: false },
      ],
    },
  ];

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" color="blue.700" mb={6}>
        Training Completion Overview
      </Heading>

      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>Employee</Th>
            <Th>Department</Th>
            <Th>Training Module</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trainingData.map((user, i) =>
            user.trainings.map((module, j) => (
              <Tr key={`${i}-${j}`}>
                <Td>{user.employee}</Td>
                <Td>{user.department}</Td>
                <Td>{module.title}</Td>
                <Td>
                  <Badge colorScheme={module.completed ? 'green' : 'red'}>
                    {module.completed ? 'Completed' : 'Pending'}
                  </Badge>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <VStack mt={8} spacing={2} align="start">
        <Text fontSize="sm" color="gray.600">
          ✅ Green = Completed | ❗ Red = Pending
        </Text>
        <Text fontSize="xs" color="gray.500">
          This view is mock-driven. Backend integration will allow filtering, reminders, and analytics.
        </Text>
      </VStack>
    </Box>
  );
};

export default AdminTrainingDashboard;

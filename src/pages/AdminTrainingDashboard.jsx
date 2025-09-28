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
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

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

  // 📊 Calculate summary stats
  const totalModules = trainingData.reduce((sum, user) => sum + user.trainings.length, 0);
  const completedModules = trainingData.reduce(
    (sum, user) => sum + user.trainings.filter((t) => t.completed).length,
    0
  );
  const pendingModules = totalModules - completedModules;

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" color="blue.700" mb={2}>
        Career Growth Dashboard
      </Heading>
      <Text fontSize="md" color="gray.600" mb={6}>
        Track employee training progress and identify areas for development.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total Modules</StatLabel>
          <StatNumber>{totalModules}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Completed</StatLabel>
          <StatNumber color="green.600">{completedModules}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pending</StatLabel>
          <StatNumber color="red.600">{pendingModules}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Divider mb={6} />

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
                  <Badge
                    colorScheme={module.completed ? 'green' : 'red'}
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {module.completed ? <CheckCircleIcon /> : <WarningIcon />}
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
          ✅ Completed modules help unlock new roles and responsibilities.
        </Text>
        <Text fontSize="xs" color="gray.500">
          This dashboard is mock-driven. Future updates will include filtering, reminders, and analytics.
        </Text>
      </VStack>
    </Box>
  );
};

export default AdminTrainingDashboard;

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
  Select,
  Input,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const AdminTrainingDashboard = () => {
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

  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const filteredData = trainingData.filter((user) => {
    const matchesDept = departmentFilter ? user.department === departmentFilter : true;
    const matchesEmp = employeeFilter ? user.employee.includes(employeeFilter) : true;
    return matchesDept && matchesEmp;
  });

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
        Track employee training progress and suggest new learning opportunities.
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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Select placeholder="Filter by department" onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="Engineering">Engineering</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </Select>
        <Input
          placeholder="Search by employee email"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
        />
      </SimpleGrid>

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
          {filteredData.map((user, i) =>
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

      <Divider my={8} />

      <Heading size="md" mb={4}>Suggest a New Training Topic</Heading>
      <FormControl mb={4}>
        <FormLabel>Training Title</FormLabel>
        <Input placeholder="e.g. Advanced Excel or Leadership Skills" />
      </FormControl>
      <Button colorScheme="teal">Submit Request</Button>

      <VStack mt={8} spacing={2} align="start">
        <Text fontSize="sm" color="gray.600">
          ✅ Completed modules help unlock new roles and responsibilities.
        </Text>
        <Text fontSize="xs" color="gray.500">
          This dashboard is mock-driven. Future updates will include reminders, analytics, and calendar integration.
        </Text>
      </VStack>
    </Box>
  );
};

export default AdminTrainingDashboard;

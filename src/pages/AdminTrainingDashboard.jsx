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
  HStack,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const AdminTrainingDashboard = () => {
  const [trainingData, setTrainingData] = useState([
    {
      employee: 'nadine@ayateke.com',
      department: 'Engineering',
      trainings: [
        { title: 'Workplace Safety', completed: true, date: '2025-09-01' },
        { title: 'Data Privacy', completed: false, date: '2025-09-15' },
      ],
    },
    {
      employee: 'alice@ayateke.com',
      department: 'Finance',
      trainings: [
        { title: 'Workplace Safety', completed: true, date: '2025-09-10' },
        { title: 'Customer Service', completed: true, date: '2025-09-20' },
      ],
    },
    {
      employee: 'john@ayateke.com',
      department: 'Operations',
      trainings: [
        { title: 'Workplace Safety', completed: false, date: '2025-09-05' },
        { title: 'Data Privacy', completed: false, date: '2025-09-18' },
      ],
    },
  ]);

  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [newTraining, setNewTraining] = useState('');

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

  const handleToggleStatus = (userIndex, trainingIndex) => {
    const updated = [...trainingData];
    updated[userIndex].trainings[trainingIndex].completed =
      !updated[userIndex].trainings[trainingIndex].completed;
    setTrainingData(updated);
  };

  const handleRemoveTraining = (userIndex, trainingIndex) => {
    const updated = [...trainingData];
    updated[userIndex].trainings.splice(trainingIndex, 1);
    setTrainingData(updated);
  };

  const handleAddTraining = () => {
    if (!selectedEmp || !newTraining.trim()) return;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const updated = trainingData.map((user) => {
      if (user.employee === selectedEmp) {
        return {
          ...user,
          trainings: [...user.trainings, { title: newTraining.trim(), completed: false, date: today }],
        };
      }
      return user;
    });
    setTrainingData(updated);
    setNewTraining('');
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" color="blue.700" mb={2}>
        Career Growth Dashboard
      </Heading>
      <Text fontSize="md" color="gray.600" mb={6}>
        Track and manage employee training progress.
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
            <Th>Date Assigned</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((user, i) =>
            user.trainings.map((module, j) => (
              <Tr key={`${i}-${j}`}>
                <Td>{user.employee}</Td>
                <Td>{user.department}</Td>
                <Td>{module.title}</Td>
                <Td>{module.date || '—'}</Td>
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
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => handleToggleStatus(i, j)}
                    >
                      Toggle
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => handleRemoveTraining(i, j)}
                    >
                      Remove
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <Divider my={8} />

      <Heading size="md" mb={4}>Add Training Module</Heading>
      <FormControl mb={4}>
        <FormLabel>Select Employee</FormLabel>
        <Select placeholder="Choose employee" onChange={(e) => setSelectedEmp(e.target.value)}>
          {trainingData.map((user) => (
            <option key={user.employee} value={user.employee}>{user.employee}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Training Title</FormLabel>
        <Input
          placeholder="e.g. Leadership Skills"
          value={newTraining}
          onChange={(e) => setNewTraining(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleAddTraining}>Add Training</Button>

      <VStack mt={8} spacing={2} align="start">
        <Text fontSize="sm" color="gray.600">
          ✅ HR can now manage training modules directly from this dashboard.
        </Text>
        <Text fontSize="xs" color="gray.500">
          This is mock-driven. Backend integration will allow saving changes permanently.
        </Text>
      </VStack>
    </Box>
  );
};

export default AdminTrainingDashboard;

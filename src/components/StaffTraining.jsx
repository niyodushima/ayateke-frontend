import {
  Box,
  Heading,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import TrainingCard from '../components/TrainingCard';

const StaffTraining = () => {
  const toast = useToast();

  // 🔧 Mock training modules
  const [modules, setModules] = useState([
    {
      id: 'module-001',
      title: 'Workplace Safety',
      description: 'Mandatory safety procedures for all staff',
      deadline: '2025-09-15',
      completed: false,
    },
    {
      id: 'module-002',
      title: 'Data Privacy & Security',
      description: 'Protecting sensitive information and systems',
      deadline: '2025-09-20',
      completed: false,
    },
    {
      id: 'module-003',
      title: 'Customer Service Excellence',
      description: 'Best practices for client communication',
      deadline: '2025-09-25',
      completed: true,
    },
  ]);

  const markCompleted = (id) => {
    const updated = modules.map((m) =>
      m.id === id ? { ...m, completed: true } : m
    );
    setModules(updated);
    toast({ title: 'Training marked as completed', status: 'success' });
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" color="teal.700" mb={6}>
        My Training Modules
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {modules.map((module) => (
          <TrainingCard
            key={module.id}
            module={module}
            onComplete={markCompleted}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StaffTraining;

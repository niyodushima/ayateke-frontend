import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';

const TrainingCard = ({ module, onComplete }) => {
  const toast = useToast();

  const handleComplete = () => {
    toast({ title: `Marked "${module.title}" as completed`, status: 'success' });
    onComplete(module.id);
  };

  return (
    <Box p={6} bg="white" boxShadow="md" borderRadius="md">
      <VStack align="start" spacing={2}>
        <Heading size="sm">{module.title}</Heading>
        <Text fontSize="sm" color="gray.600">{module.description}</Text>
        <Text fontSize="xs" color="gray.500">
          Deadline: {module.deadline}
        </Text>
        <Badge colorScheme={module.completed ? 'green' : 'red'}>
          {module.completed ? 'Completed' : 'Pending'}
        </Badge>
        {!module.completed && (
          <Button size="sm" colorScheme="teal" onClick={handleComplete}>
            Mark as Completed
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default TrainingCard;

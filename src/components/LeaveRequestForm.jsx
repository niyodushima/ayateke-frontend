import {
  Box,
  Heading,
  Textarea,
  Button,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

const LeaveRequestForm = () => {
  const [reason, setReason] = useState('');
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: 'Please enter a reason',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Leave request submitted',
      description: reason,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setReason('');
  };

  return (
    <Box p={4} bg={bg} rounded="md" shadow="md" w="full">
      <Heading size="sm" mb={4}>Request Leave</Heading>
      <VStack spacing={4}>
        <Textarea
          placeholder="Enter reason for leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Submit Request
        </Button>
      </VStack>
    </Box>
  );
};

export default LeaveRequestForm;

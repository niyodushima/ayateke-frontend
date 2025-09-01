import { Box, Heading, Textarea, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';

const LeaveRequestForm = () => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    // You can connect this to your backend later
    alert(`Leave request submitted: ${reason}`);
    setReason('');
  };

  return (
    <Box p={4} bg="white" rounded="md" shadow="md" w="full">
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

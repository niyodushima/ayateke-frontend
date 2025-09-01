import { Box, Heading, Text } from '@chakra-ui/react';

const Reports = () => {
  let user = null;
  try {
    const rawUser = localStorage.getItem('user');
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (err) {
    console.error('Invalid user object in localStorage:', err);
  }

  return (
    <Box p={6} bg="white" rounded="md" shadow="md">
      <Heading size="md" mb={4}>Reports Dashboard</Heading>
      <Text>Welcome, {user?.name || 'Guest'}</Text>
      <Text>Your role: {user?.role || 'Unknown'}</Text>
    </Box>
  );
};

export default Reports;

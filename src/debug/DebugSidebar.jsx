import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { FiHome } from 'react-icons/fi';

const DebugSidebar = () => {
  return (
    <Box w="250px" p={5} bg="gray.50">
      <Text mb={4} fontWeight="bold">Debug Sidebar</Text>
      <VStack align="start" spacing={4}>
        <Flex align="center" gap={3}>
          <FiHome size={20} />
          <Text>Dashboard</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default DebugSidebar;

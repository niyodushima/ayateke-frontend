import { Flex, Text } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';

const DebugNavItem = () => {
  return (
    <Flex align="center" gap={3} p={4}>
      <FiUsers size={20} />
      <Text>Staff Directory</Text>
    </Flex>
  );
};

export default DebugNavItem;

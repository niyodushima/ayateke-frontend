import {
  Box,
  Text,
  Heading,
  Button,
  VStack,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

const ContractCard = () => {
  // 🔧 Mock contract data — replace with API later
  const contract = {
    start_date: '2023-01-01',
    role: 'Software Engineer',
    salary: 1200000,
    contract_url: 'https://yourdomain.com/contracts/niyodushima.pdf',
  };

  return (
    <Box p={6} bg="white" boxShadow="md" borderRadius="md" mb={8}>
      <Heading size="md" mb={4}>Your Contract</Heading>
      <VStack align="start" spacing={2}>
        <Text><strong>Start Date:</strong> {contract.start_date}</Text>
        <Text><strong>Role:</strong> {contract.role}</Text>
        <Text><strong>Salary:</strong> RWF {contract.salary.toLocaleString()}</Text>
        {contract.contract_url && (
          <Button
            as="a"
            href={contract.contract_url}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<DownloadIcon />}
            colorScheme="teal"
            mt={4}
          >
            Download Contract
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ContractCard;

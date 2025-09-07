import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react';

const StaffProfile = () => {
  // Mock data — replace with API data
  const contract = {
    position: 'Software Engineer',
    startDate: '2023-01-15',
    endDate: '2025-01-15',
    status: 'Active',
  };

  const payslips = [
    { month: 'August 2025', amount: '1,200,000 RWF', status: 'Paid' },
    { month: 'July 2025', amount: '1,200,000 RWF', status: 'Paid' },
    { month: 'June 2025', amount: '1,200,000 RWF', status: 'Pending' },
  ];

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" color="teal.700" mb={6}>
        My Profile
      </Heading>

      {/* Contract Overview */}
      <Card mb={8} _hover={{ transform: 'scale(1.01)', transition: '0.2s' }}>
        <CardBody>
          <Heading size="md" mb={4}>Contract Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Flex justify="space-between">
              <Text fontWeight="bold">Position:</Text>
              <Text>{contract.position}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Start Date:</Text>
              <Text>{contract.startDate}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">End Date:</Text>
              <Text>{contract.endDate}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Status:</Text>
              <Badge colorScheme={contract.status === 'Active' ? 'green' : 'red'}>
                {contract.status}
              </Badge>
            </Flex>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Divider mb={8} />

      {/* Payslip History */}
      <Card _hover={{ transform: 'scale(1.01)', transition: '0.2s' }}>
        <CardBody>
          <Heading size="md" mb={4}>Payslip History</Heading>
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th>Month</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payslips.map((p, i) => (
                  <Tr key={i}>
                    <Td>{p.month}</Td>
                    <Td>{p.amount}</Td>
                    <Td>
                      <Badge colorScheme={p.status === 'Paid' ? 'green' : 'orange'}>
                        {p.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default StaffProfile;

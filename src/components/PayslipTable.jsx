import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';

const PayslipTable = () => {
  // 🔧 Mock payslip data — replace with API later
  const payslips = [
    {
      month: 'August 2025',
      amount: 100000,
      status: 'paid',
      payment_date: '2025-08-28',
    },
    {
      month: 'July 2025',
      amount: 100000,
      status: 'paid',
      payment_date: '2025-07-28',
    },
    {
      month: 'June 2025',
      amount: 100000,
      status: 'pending',
      payment_date: null,
    },
  ];

  return (
    <Box p={6} bg="white" boxShadow="md" borderRadius="md">
      <Heading size="md" mb={4}>Payslip History</Heading>
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>Month</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Payment Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payslips.length === 0 ? (
            <Tr>
              <Td colSpan={4} textAlign="center">No payslips available.</Td>
            </Tr>
          ) : (
            payslips.map((p, i) => (
              <Tr key={i}>
                <Td>{p.month}</Td>
                <Td>RWF {p.amount.toLocaleString()}</Td>
                <Td>{p.status}</Td>
                <Td>{p.payment_date || '—'}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PayslipTable;

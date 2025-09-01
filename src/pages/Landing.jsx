import { Box, Button, Heading, Text, Image, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bgImage="url('/background.jpeg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box bg="whiteAlpha.900" p={8} rounded="lg" shadow="xl" textAlign="center">
        <VStack spacing={4}>
          <Image src="/logo.jpeg" alt="Ayateke Logo" boxSize="80px" />
          <Heading size="md">Ayateke Staff Management</Heading>
          <Text fontSize="sm" color="gray.600">
            Delivering Sustainable Water Solutions Across Rwanda
          </Text>
          <Button colorScheme="teal" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </VStack>
      </Box>
    </Box> // ✅ This was missing
  );
};

export default Landing;

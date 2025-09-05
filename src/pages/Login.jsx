import {
  Box,
  Input,
  Button,
  Heading,
  useToast,
  Image,
  Text,
  VStack,
  Divider,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      toast({ title: 'Login successful', status: 'success', duration: 3000 });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const role = data.user.role;
      navigate(role === 'admin' ? '/admin/dashboard' : '/staff');
    } catch (error) {
      toast({ title: 'Login failed', description: error.message, status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      bgImage="linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/background.jpeg')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box bg="whiteAlpha.900" p={8} rounded="lg" shadow="2xl" maxW="md" w="full">
        <VStack spacing={4}>
          <Image src="/logo.jpeg" alt="Ayateke Logo" boxSize="90px" />
          <Heading size="md" textAlign="center">Ayateke Staff Management</Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Delivering Sustainable Water Solutions Across Rwanda
          </Text>

          <Input
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />

          <InputGroup>
            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            colorScheme="teal"
            w="full"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Login
          </Button>
        </VStack>

        <Divider my={6} />
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Ayateke Star © {new Date().getFullYear()} — Empowering Rwanda through clean water.
        </Text>
      </Box>
    </Box>
  );
};

export default Login;

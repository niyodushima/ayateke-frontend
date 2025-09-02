import {
  Flex,
  Spacer,
  Avatar,
  Text,
  Box,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Flex
      bg={bg}
      p={4}
      shadow="sm"
      align="center"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Text fontWeight="bold" fontSize="lg" color={textColor}>
        Welcome, {user?.role === 'admin' ? 'Admin' : 'Staff'}
      </Text>
      <Spacer />
      <Flex align="center" gap={4}>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          variant="ghost"
          aria-label="Toggle theme"
        />
        <Avatar name={user?.name || 'User'} src={user?.avatar || ''} />
      </Flex>
    </Flex>
  );
};

export default Navbar;

// src/components/StatsCard.jsx
import { Box, Heading, Text } from '@chakra-ui/react';

const StatsCard = ({ label, value }) => {
  return (
    <Box
      p={6}
      bg="white"
      rounded="md"
      shadow="md"
      textAlign="center"
      border="1px solid #e2e8f0"
    >
      <Heading size="lg" color="teal.600">
        {typeof value === 'string' || typeof value === 'number' ? value : '—'}
      </Heading>
      <Text mt={2} fontSize="sm" color="gray.600">
        {label}
      </Text>
    </Box>
  );
};

export default StatsCard;

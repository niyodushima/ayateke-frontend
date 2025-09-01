// src/components/EmployeeCards.jsx
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function EmployeeCards({ cards }) {
  const navigate = useNavigate();

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
      gap={6}
    >
      {cards.map((card) => (
        <motion.div
          key={card.title}
          onClick={() => navigate(card.path)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            backgroundColor: card.bg || '#fff',
          }}
        >
          {/* ✅ Safe icon rendering */}
          <Box fontSize="3xl" mb={4} color="gray.700">
            {React.isValidElement(card.icon)
              ? card.icon
              : typeof card.icon === 'string'
              ? card.icon
              : <Text>Invalid icon</Text>}
          </Box>

          <Text fontSize="xl" fontWeight="semibold" color="gray.800">
            {card.title}
          </Text>
        </motion.div>
      ))}
    </Box>
  );
}

export default EmployeeCards;

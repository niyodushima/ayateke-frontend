                : '4px solid transparent'}
                color={textColor}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                transition="all 0.2s ease"
              >
                <Flex align="center" gap={3}>
                  <Box as={item.icon} fontSize="lg" />
                  <Text>{item.label}</Text>
                </Flex>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <Badge colorScheme="teal" borderRadius="md">{item.badge}</Badge>
                )}
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      <Flex mt={8} pt={4} borderTop="1px solid" borderColor={hoverBg} align="center" justify="space-between">
        <Text fontSize="sm" color="gray.500">Signed in</Text>
        <IconButton
          icon={<FaSignOutAlt />}
          onClick={handleLogout}
          size="sm"
          variant="outline"
          aria-label="Logout"
        />
      </Flex>
    </Box>
  );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Input, Button, VStack, Text, TableContainer
} from '@chakra-ui/react';

const API = 'https://ayateke-backend.onrender.com/api/branches';

const BranchManager = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntries, setNewEntries] = useState({});

  const fetchBranches = async () => {
    try {
      const res = await axios.get(API);
      setBranches(res.data);
    } catch (err) {
      console.error('Error fetching branches:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleStaffNameChange = async (branchName, staffId, name) => {
    try {
      await axios.put(`${API}/${branchName}/staff/${staffId}`, { name });
      fetchBranches();
    } catch (err) {
      console.error('Error updating staff name:', err.message);
    }
  };

  const handleAddEntry = async (branchName, tableName) => {
    const name = newEntries[`${branchName}-${tableName}`];
    if (!name) return;

    try {
      await axios.post(`${API}/${branchName}/${tableName}`, { name });
      setNewEntries({ ...newEntries, [`${branchName}-${tableName}`]: '' });
      fetchBranches();
    } catch (err) {
      console.error('Error adding entry:', err.message);
    }
  };

  if (loading) return <Text p={8}>Loading branches...</Text>;

  return (
    <Box p={8}>
      <Heading mb={6}>🏢 Branch Manager</Heading>

      {branches.map((branch) => (
        <Box key={branch.branch} mb={10}>
          <Heading size="md" mb={4}>{branch.branch}</Heading>

          {/* Staff Table */}
          <Heading size="sm" mb={2}>Staff</Heading>
          <TableContainer mb={4}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Role</Th>
                  <Th>Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {branch.staff.map((s) => (
                  <Tr key={s.id}>
                    <Td>{s.role}</Td>
                    <Td>
                      <Input
                        size="sm"
                        value={s.name}
                        placeholder="Unassigned"
                        onChange={(e) =>
                          handleStaffNameChange(branch.branch, s.id, e.target.value)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Scheme Managers Table */}
          <Heading size="sm" mb={2}>Scheme Managers</Heading>
          <TableContainer mb={2}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {branch.schemeManagers.map((m) => (
                  <Tr key={m.id}>
                    <Td>{m.name}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <VStack align="start" mb={6}>
            <Input
              size="sm"
              placeholder="Add scheme manager"
              value={newEntries[`${branch.branch}-schemeManagers`] || ''}
              onChange={(e) =>
                setNewEntries({ ...newEntries, [`${branch.branch}-schemeManagers`]: e.target.value })
              }
            />
            <Button size="sm" colorScheme="teal" onClick={() => handleAddEntry(branch.branch, 'schemeManagers')}>
              Add Scheme Manager
            </Button>
          </VStack>

          {/* Plumbers Table */}
          <Heading size="sm" mb={2}>Plumbers</Heading>
          <TableContainer mb={2}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {branch.plumbers.map((p) => (
                  <Tr key={p.id}>
                    <Td>{p.name}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <VStack align="start">
            <Input
              size="sm"
              placeholder="Add plumber"
              value={newEntries[`${branch.branch}-plumbers`] || ''}
              onChange={(e) =>
                setNewEntries({ ...newEntries, [`${branch.branch}-plumbers`]: e.target.value })
              }
            />
            <Button size="sm" colorScheme="blue" onClick={() => handleAddEntry(branch.branch, 'plumbers')}>
              Add Plumber
            </Button>
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

export default BranchManager;

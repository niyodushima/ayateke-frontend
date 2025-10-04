import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Input, Button, Text, TableContainer
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

  const handleRoleNameChange = async (branchName, roleId, name) => {
    try {
      await axios.put(`${API}/${encodeURIComponent(branchName)}/roles/${roleId}`, { name });
      fetchBranches();
    } catch (err) {
      console.error('Error updating role name:', err.message);
    }
  };

  const handleAddRole = async (branchName) => {
    const key = `${branchName}-new-role`;
    const role = newEntries[key]?.role;
    const name = newEntries[key]?.name;

    if (!role) return;

    try {
      await axios.post(`${API}/${encodeURIComponent(branchName)}/roles`, { role, name });
      setNewEntries({ ...newEntries, [key]: { role: '', name: '' } });
      fetchBranches();
    } catch (err) {
      console.error('Error adding role:', err.message);
    }
  };

  if (loading) return <Text p={8}>Loading branches...</Text>;

  return (
    <Box p={8}>
      <Heading mb={6}>🏢 Branch Manager</Heading>

      {branches.map((branch) => (
        <Box key={branch.branch} mb={10}>
          <Heading size="md" mb={4}>{branch.branch}</Heading>

          {/* Roles Table */}
          <Heading size="sm" mb={2}>Staff Roles</Heading>
          <TableContainer mb={4}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Role</Th>
                  <Th>Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {branch.roles.map((r) => (
                  <Tr key={r.id}>
                    <Td>{r.role}</Td>
                    <Td>
                      <Input
                        size="sm"
                        placeholder="Unassigned"
                        value={r.name || ''}
                        onChange={(e) =>
                          handleRoleNameChange(branch.branch, r.id, e.target.value)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Add New Role */}
          <Heading size="sm" mb={2}>Add Role</Heading>
          <Box mb={4}>
            <Input
              size="sm"
              placeholder="Role title"
              value={newEntries[`${branch.branch}-new-role`]?.role || ''}
              onChange={(e) =>
                setNewEntries({
                  ...newEntries,
                  [`${branch.branch}-new-role`]: {
                    ...newEntries[`${branch.branch}-new-role`],
                    role: e.target.value
                  }
                })
              }
              mb={2}
            />
            <Input
              size="sm"
              placeholder="Assigned name (optional)"
              value={newEntries[`${branch.branch}-new-role`]?.name || ''}
              onChange={(e) =>
                setNewEntries({
                  ...newEntries,
                  [`${branch.branch}-new-role`]: {
                    ...newEntries[`${branch.branch}-new-role`],
                    name: e.target.value
                  }
                })
              }
              mb={2}
            />
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => handleAddRole(branch.branch)}
            >
              + Add Role
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BranchManager;

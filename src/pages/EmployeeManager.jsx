import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Input, Button, Text, TableContainer
} from '@chakra-ui/react';

const API = 'https://ayateke-backend.onrender.com/api/employees';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({ name: '', role: '', email: '', tel: '', address: '' });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      await axios.put(`${API}/${id}`, { [field]: value });
      fetchEmployees();
    } catch (err) {
      console.error('Error updating employee:', err.message);
    }
  };

  const handleAdd = async () => {
    if (!newEntry.name || !newEntry.role) return;
    try {
      await axios.post(API, newEntry);
      setNewEntry({ name: '', role: '', email: '', tel: '', address: '' });
      fetchEmployees();
    } catch (err) {
      console.error('Error adding employee:', err.message);
    }
  };

  if (loading) return <Text p={8}>Loading employees...</Text>;

  return (
    <Box p={8}>
      <Heading mb={6}>👥 Employee Manager</Heading>

      <TableContainer mb={6}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Tel</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((emp) => (
              <Tr key={emp.id}>
                <Td>
                  <Input
                    size="sm"
                    value={emp.name || ''}
                    onChange={(e) => handleUpdate(emp.id, 'name', e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    value={emp.role || ''}
                    onChange={(e) => handleUpdate(emp.id, 'role', e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    value={emp.email || ''}
                    onChange={(e) => handleUpdate(emp.id, 'email', e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    value={emp.tel || ''}
                    onChange={(e) => handleUpdate(emp.id, 'tel', e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    value={emp.address || ''}
                    onChange={(e) => handleUpdate(emp.id, 'address', e.target.value)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Heading size="sm" mb={2}>Add New Employee</Heading>
      <Box mb={4}>
        <Input
          size="sm"
          placeholder="Name"
          value={newEntry.name}
          onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
          mb={2}
        />
        <Input
          size="sm"
          placeholder="Role"
          value={newEntry.role}
          onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
          mb={2}
        />
        <Input
          size="sm"
          placeholder="Email"
          value={newEntry.email}
          onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
          mb={2}
        />
        <Input
          size="sm"
          placeholder="Tel"
          value={newEntry.tel}
          onChange={(e) => setNewEntry({ ...newEntry, tel: e.target.value })}
          mb={2}
        />
        <Input
          size="sm"
          placeholder="Address"
          value={newEntry.address}
          onChange={(e) => setNewEntry({ ...newEntry, address: e.target.value })}
          mb={2}
        />
        <Button size="sm" colorScheme="teal" onClick={handleAdd}>
          + Add Employee
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeManager;

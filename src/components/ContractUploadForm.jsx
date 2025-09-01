// src/components/ContractUploadForm.jsx
import {
  Box, Button, Input, FormControl, FormLabel, Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

const ContractUploadForm = ({ staffList }) => {
  const [formData, setFormData] = useState({
    staff_id: '',
    start_date: '',
    end_date: '',
    contract: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('staff_id', formData.staff_id);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('contract', formData.contract);

    try {
      await axios.post('http://localhost:5000/api/contracts/upload', data);
      alert('Contract uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} shadow="md" rounded="md" bg="white">
      <FormControl mb={4}>
        <FormLabel>Staff Member</FormLabel>
        <Select name="staff_id" onChange={handleChange} placeholder="Select staff">
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {typeof staff.name === 'string' ? staff.name : 'Unnamed'}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Start Date</FormLabel>
        <Input type="date" name="start_date" onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>End Date</FormLabel>
        <Input type="date" name="end_date" onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Contract File</FormLabel>
        <Input type="file" name="contract" onChange={handleChange} />
      </FormControl>

      <Button type="submit" colorScheme="teal">Upload Contract</Button>
    </Box>
  );
};

export default ContractUploadForm;

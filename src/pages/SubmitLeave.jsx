import { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';

export default function SubmitLeave() {
  const [formData, setFormData] = useState({
    employee_id: '',
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leaves', formData);
      setSubmitted(true);
      setFormData({
        employee_id: '',
        type: '',
        start_date: '',
        end_date: '',
        reason: '',
      });
    } catch (err) {
      console.error(err);
      alert('Submission failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full">
        <div className="flex items-center mb-6">
          <FaCalendarAlt className="text-indigo-600 text-3xl mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Submit Leave Request</h2>
        </div>

        {submitted ? (
          <div className="text-green-600 text-center font-medium animate-pulse">
            ✅ Your leave request has been submitted!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input name="employee_id" value={formData.employee_id} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                <option value="">Select type</option>
                <option value="Annual">Annual</option>
                <option value="Sick">Sick</option>
                <option value="Maternity">Maternity</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Optional" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

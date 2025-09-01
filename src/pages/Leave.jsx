import DashboardLayout from '../components/DashboardLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Leave() {
  function handleSubmit(e) {
    e.preventDefault();
    toast.success('Leave request submitted!');
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">Request Leave</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block font-medium">Leave Type</label>
          <select className="border rounded px-3 py-2 w-full">
            <option>Sick Leave</option>
            <option>Annual Leave</option>
            <option>Emergency Leave</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">From</label>
          <input type="date" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block font-medium">To</label>
          <input type="date" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block font-medium">Reason</label>
          <textarea className="border rounded px-3 py-2 w-full" rows="3" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit Request
        </button>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  );
}

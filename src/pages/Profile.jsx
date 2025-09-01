import DashboardLayout from '../components/DashboardLayout';

export default function Profile() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input className="border rounded px-3 py-2 w-full" defaultValue="John Doe" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input className="border rounded px-3 py-2 w-full" defaultValue="john@ayateke.com" />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input className="border rounded px-3 py-2 w-full" defaultValue="+250 788 123 456" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </DashboardLayout>
  );
}

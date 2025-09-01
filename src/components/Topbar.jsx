const user = JSON.parse(localStorage.getItem('user'));

export default function Topbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-3 py-1 w-1/3"
      />
      <div className="flex items-center gap-4">
        <span className="text-gray-600">🔔</span>
        <span className="text-gray-600">👤 John Doe</span>
      </div>
    </header>
  );
}

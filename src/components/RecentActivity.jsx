export default function RecentActivity() {
  const updates = [
    "✅ Leave approved for Aug 12–14",
    "📄 Payslip for July is ready to download",
    "⏰ Clock-in correction request approved",
  ];

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-2">
        {updates.map((update, index) => (
          <li key={index} className="text-gray-700">
            {update}
          </li>
        ))}
      </ul>
    </div>
  );
}

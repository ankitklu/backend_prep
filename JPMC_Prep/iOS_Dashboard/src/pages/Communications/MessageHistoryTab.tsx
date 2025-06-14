const mockHistory = [
  {
    id: 1,
    message: "Meeting at 4PM",
    recipients: ["admins"],
    sentAt: "2025-06-14T12:00:00Z",
  },
  {
    id: 2,
    message: "Reminder: Event tomorrow",
    recipients: ["volunteers", "admins"],
    sentAt: "2025-06-13T09:30:00Z",
  },
];

const MessageHistoryTab = () => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Message History</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Recipients</th>
            <th className="p-2 border">Sent At</th>
          </tr>
        </thead>
        <tbody>
          {mockHistory.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.message}</td>
              <td className="p-2 border">{item.recipients.join(", ")}</td>
              <td className="p-2 border">{new Date(item.sentAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageHistoryTab;

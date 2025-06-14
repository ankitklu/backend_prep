import { useState } from "react";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);

  const toggleRecipient = (role: string) => {
    setRecipients((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend API
    alert(`Sending to: ${recipients.join(", ")}\nMessage: ${message}`);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow-md h-[400px]">
      <h2 className="text-xl font-semibold mb-2">Send Message</h2>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={5}
        placeholder="Enter your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="mb-4 flex gap-4">
        <label>
          <input
            type="checkbox"
            onChange={() => toggleRecipient("admins")}
            checked={recipients.includes("admins")}
          />{" "}
          Admins
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => toggleRecipient("volunteers")}
            checked={recipients.includes("volunteers")}
          />{" "}
          Volunteers
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send (WhatsApp + Email)
      </button>
    </form>
  );
};

export default MessageForm;

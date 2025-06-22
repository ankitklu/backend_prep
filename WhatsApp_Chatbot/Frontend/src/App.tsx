import React, { useEffect, useState } from "react";
import axios from "axios";

interface Campaign {
  title: string;
  description: string;
  date: string;
}

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState<Campaign>({ title: "", description: "", date: "" });

  const fetchCampaigns = async () => {
    const res = await axios.get("http://localhost:5000/api/campaigns");
    setCampaigns(res.data);
  };

  const addCampaign = async () => {
    await axios.post("http://localhost:5000/api/campaigns", form);
    setForm({ title: "", description: "", date: "" });
    fetchCampaigns();
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Campaign Admin</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <button onClick={addCampaign}>Add Campaign</button>

      <h3>Upcoming Campaigns</h3>
      <ul>
        {campaigns.map((c, i) => (
          <li key={i}>
            <strong>{c.title}</strong> - {c.date}
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

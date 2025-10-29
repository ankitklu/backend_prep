import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = async () => {
    const res = await axios.post("http://localhost:5000/send", {
      email,
      subject,
      message,
    });
    alert(res.data.message);
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Email Notification Form</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} /><br />
      <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} /><br />
      <button onClick={sendEmail}>Send</button>
    </div>
  );
}

export default App;

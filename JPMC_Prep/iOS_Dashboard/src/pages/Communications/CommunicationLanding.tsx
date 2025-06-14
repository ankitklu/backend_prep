import { useState } from "react";
// import CalendarPanel from "../components/CalendarPanel";
// import MessageForm from "../components/MessageForm";
// import MessageHistoryTab from "../components/MessageHistoryTab";

const CommunicationLanding = () => {
  const [activeTab, setActiveTab] = useState<"schedule" | "history">("schedule");

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <button onClick={() => setActiveTab("schedule")} className={activeTab === "schedule" ? "font-bold" : ""}>
          Schedule Meeting
        </button>
        <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "font-bold" : ""}>
          Message History
        </button>
      </div>

      {activeTab === "schedule" ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            {/* <CalendarPanel /> */}
            Calendar Panel Placeholder
          </div>
          <div className="w-full md:w-1/2">
            {/* <MessageForm /> */}
            Message Form
          </div>
        </div>
      ) : (
        // <MessageHistoryTab />
        <div>History tab</div>
      )}
    </div>
  );
};

export default CommunicationLanding;

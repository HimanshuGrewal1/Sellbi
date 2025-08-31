import { useState, useEffect } from "react";

function RecentLogs() {
  const [logs, setLogs] = useState([]);

  const addLog = (action) => {
    setLogs((prev) => {
      const newLogs = [...prev, { action, time: new Date().toLocaleTimeString() }];
      return newLogs.slice(-20);
    });
  };

  useEffect(() => {
 
    const handleClick = (e) => {
      addLog(`Clicked on: ${e.target.tagName}`);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recent Logs (Last 20)</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            {log.time} — {log.action}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentLogs;
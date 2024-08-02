// DevLogs.tsx
import React from 'react';
import './DevLogs.css';


interface UpdateLog {
  date: string;
  version: string;
  changes: string[];
}

const updateLogs: UpdateLog[] = [
  {
    date: "2023-07-31",
    version: "1.0.0",
    changes: [
      "Initial release of ChatUTD",
      "Implemented basic chat functionality",
      "Added Question of the Day feature"
    ]
  },
  {
    date: "2023-08-07",
    version: "1.1.0",
    changes: [
      "Improved UI layout",
      "Added timestamps to messages",
      "Implemented Dev Logs page"
    ]
  }
  // Add more update logs as you implement new features
];

const DevLogs: React.FC = () => {
  return (
    <div className="dev-logs">
      <h2>Development Updates</h2>
      {updateLogs.map((log, index) => (
        <div key={index} className="update-log">
          <h3>{log.date} - Version {log.version}</h3>
          <ul>
            {log.changes.map((change, changeIndex) => (
              <li key={changeIndex}>{change}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DevLogs;
import React from 'react';
import './DevLogs.css';

interface UpdateLog {
  date: string;
  version: string;
  changes: string[];
}

const updateLogs: UpdateLog[] = [
  {
    date: "2024-08-03",
    version: "1.0.0",
    changes: [
      "Initial release of ChatUTD",
      "Implemented basic chat functionality",
      "Added Question of the Day feature",
      "Created basic responsive design"
    ]
  }
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
      <p className="suggestion-link">
        Have any suggestions? <a href="https://forms.gle/your-google-form-link" target="_blank" rel="noopener noreferrer">Let us know!</a>
      </p>
    </div>
  );
};

export default DevLogs;

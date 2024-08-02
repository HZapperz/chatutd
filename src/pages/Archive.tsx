import React from 'react';
import './Archive.css';

const Archive: React.FC = () => {
  // This is a placeholder for archived items
  const archivedItems = [
    { id: 1, title: 'Chat Topic 1', date: '2023-05-01' },
    { id: 2, title: 'Chat Topic 2', date: '2023-05-02' },
    { id: 3, title: 'Chat Topic 3', date: '2023-05-03' },
  ];

  return (
    <div className="archive-container">
      <h1>Archive</h1>
      <ul className="archive-list">
        {archivedItems.map((item) => (
          <li key={item.id} className="archive-item">
            <span className="archive-item-title">{item.title}</span>
            <span className="archive-item-date">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
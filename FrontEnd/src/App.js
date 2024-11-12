import React from 'react';
import ApplicationTracker from './components/ApplicationTracker';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
      </header>
      <main>
        <ApplicationTracker />
      </main>
    </div>
  );
}

export default App;
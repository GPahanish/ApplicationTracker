import React, { useState, useEffect } from 'react';
import './ApplicationTracker.css';

const API_URL = 'http://127.0.0.1:5000/api';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newApp, setNewApp] = useState({
    company: '',
    position: '',
    status: 'applied',
    dateApplied: '',
    notes: ''
  });

  // Fetch applications when component mounts
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications`,{
        headers: {
            'Content-Type': 'application/json'
          }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new application
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApp),
      });

      if (!response.ok) {
        throw new Error('Failed to add application');
      }

      const addedApplication = await response.json();
      setApplications([...applications, addedApplication]);
      setNewApp({
        company: '',
        position: '',
        status: 'applied',
        dateApplied: '',
        notes: ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to add application. Please try again.');
      console.error('Error:', err);
    }
  };

  // Delete application
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setApplications(applications.filter(app => app.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete application. Please try again.');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="tracker-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-grid">
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <h2>Add New Application</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="application-form">
              <input
                type="text"
                placeholder="Company"
                value={newApp.company}
                onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Position"
                value={newApp.position}
                onChange={(e) => setNewApp({ ...newApp, position: e.target.value })}
                required
              />
              <select
                value={newApp.status}
                onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
              </select>
              <input
                type="date"
                value={newApp.dateApplied}
                onChange={(e) => setNewApp({ ...newApp, dateApplied: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Notes"
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
              />
              <button type="submit" className="submit-button">
                Add Application
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-details">
              <h3>{app.company}</h3>
              <p className="position">{app.position}</p>
              <p>Status: {app.status}</p>
              <p>Applied: {app.dateApplied}</p>
              {app.notes && <p className="notes">{app.notes}</p>}
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(app.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from '../../constants/apiConstants';

function Home(props) {
  const [dataUser, setDataUser] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
     // Add CORS headers to the request
     const config = {
      headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Bypass ngrok browser warning
      }
  };
    try {
      const response = await axios.get(`${API_BASE_URL}/users`,config);
      console.log('API Response:', response.data);
      
      // Ensure we're working with an array
      if (!Array.isArray(response.data)) {
        // If response.data is an object with a users property
        if (response.data.users && Array.isArray(response.data.users)) {
          setDataUser(response.data.users);
        } else {
          // If it's a single user object, wrap it in an array
          setDataUser(response.data ? [response.data] : []);
        }
      } else {
        setDataUser(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Error fetching users: ' + err.message);
      console.error('Fetch error:', err);
      setDataUser([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Would you like to delete?");
    if (confirm) {
      try {
        const config = {
          headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true' // Bypass ngrok browser warning
          }
        };
        await axios.delete(`${API_BASE_URL}/users/${id}`,config);
        await fetchUsers();
      } catch (err) {
        setError('Error deleting user: ' + err.message);
        console.error('Delete error:', err);
      }
    }
  };

  // Safe rendering with data validation
  const renderUserRow = (user) => {
    if (!user || typeof user !== 'object') return null;
    
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name || 'N/A'}</td>
        <td>{user.email || 'N/A'}</td>
        <td>{user.phone || 'N/A'}</td>
        <td>
          <Link
            to={`/read/${user.id}`}
            className="btn btn-sm btn-info me-2"
          >
            Read
          </Link>
          <Link
            to={`/update/${user.id}`}
            className="btn btn-sm btn-primary me-2"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(user.id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>List of Users</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="d-flex justify-content-end">
          <Link to="/create" className="btn btn-success">
            Add+
          </Link>
        </div>
        {!Array.isArray(dataUser) || dataUser.length === 0 ? (
          <div className="alert alert-info mt-3">No users found</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataUser.map(renderUserRow)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;
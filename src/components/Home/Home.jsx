import React, { useState, useEffect } from 'react';
import axios from "axios";
import { API_BASE_URL } from '../../constants/apiConstants';
import { Users } from 'lucide-react';
import { CreateUserModal, ReadUserModal, UpdateUserModal } from '../CrudModals/CrudModals';
import { Button } from "@/components/ui/button";

function Home(props) {
  const [dataUser, setDataUser] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    };
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, config);
      console.log('API Response:', response.data);
      
      if (!Array.isArray(response.data)) {
        if (response.data.users && Array.isArray(response.data.users)) {
          setDataUser(response.data.users);
        } else {
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
            'ngrok-skip-browser-warning': 'true'
          }
        };
        await axios.delete(`${API_BASE_URL}/users/${id}`, config);
        await fetchUsers();
      } catch (err) {
        setError('Error deleting user: ' + err.message);
        console.error('Delete error:', err);
      }
    }
  };

  const renderUserRow = (user) => {
    if (!user || typeof user !== 'object') return null;
    
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name || 'N/A'}</td>
        <td>{user.email || 'N/A'}</td>
        <td>{user.phone || 'N/A'}</td>
        <td>
          <ReadUserModal
            userId={user.id}
            trigger={
              <Button variant="outline" className="btn btn-sm btn-info m-2">
                Read
              </Button>
            }
          />
          <UpdateUserModal
            userId={user.id}
            onSuccess={fetchUsers}
            trigger={
              <Button variant="outline" className="btn btn-sm btn-primary m-2">
                Edit
              </Button>
            }
          />
          <Button
            variant="outline"
            className="btn btn-sm btn-danger m-2"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
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
    <div className="d-flex flex-column justify-content-center align-items-center g-gray-100 min-h-screen p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Users size={40} className="text-blue-600 m-2" />
          <h1 className="m-0 font-bold text-3xl text-gray-800">
            List of Users
          </h1>
        </div>
      </div>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="table-responsive">
          <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
            <div className="d-flex justify-content-end mb-3">
              <CreateUserModal onSuccess={fetchUsers} />
            </div>
            {!Array.isArray(dataUser) || dataUser.length === 0 ? (
              <div className="alert alert-info mt-3">No users found</div>
            ) : (
              <table className="table table-striped" style={{ minWidth: '750px' }}>
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
      </div>
    </div>
  );
}

export default Home;
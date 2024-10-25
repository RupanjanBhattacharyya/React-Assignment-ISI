import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from '../../constants/apiConstants';

function Read() {
  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Fix: Add forward slash between base URL and ID
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        setDataUser(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching user details: ' + err.message);
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]); // Fix: Add id as dependency

  if (loading) {
    return (
      <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Detail of User</h1>
        <div className="mb-2">
          <strong>Name: </strong>
          <span>{dataUser.name || 'N/A'}</span>
        </div>
        <div className="mb-2">
          <strong>Email: </strong>
          <span>{dataUser.email || 'N/A'}</span>
        </div>
        <div className="mb-2">
          <strong>Phone: </strong>
          <span>{dataUser.phone || 'N/A'}</span>
        </div>
        <div className="mt-3">
          <Link to={`/update/${id}`} className="btn btn-success">
            Update
          </Link>
          <Link to="/home" className="btn btn-primary ms-3">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Read;
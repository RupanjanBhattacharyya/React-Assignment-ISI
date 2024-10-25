import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {API_BASE_URL} from '../../constants/apiConstants';
function Update() {
  const [User, setUser] = useState({});
  const { id } = useParams();
  useEffect(() => {
      axios
        .get(`${API_BASE_URL}/users/${id}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }, [id]);
  const navigate = useNavigate();
  const UpdateUser = (e) => {
    e.preventDefault();
    axios.put(`${API_BASE_URL}/users/${id}`, User)
    .then((res) => {
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg white shadow px-5 pt-3 pb-5 rounded">
        <h1>Update User {User.userName}</h1>
        <form onSubmit={UpdateUser}>
          <div className="mb-2">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              className="form-control mb-2"
              value={User.name}
              onChange={(e) => setUser({ ...User, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={User.email}
              onChange={(e) => setUser({ ...User, email: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              name="phone"
              className="form-control"
              value={User.phone}
              onChange={(e) => setUser({ ...User, phone: e.target.value })}
            />
          </div>

          <button className="btn btn-success">Update</button>
          <Link to="/home" className="btn btn-primary ms-3">
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}
export default Update;

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from '../../constants/apiConstants';

// Create User Modal Component
export const CreateUserModal = ({ onSuccess }) => {
  const [User, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    // Name validation
    if (User.name.length  < 3) {
      newErrors.name = "Username must be at least 3 characters long";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!User.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(User.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!User.phone) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(User.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const AddUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    };
    axios
      .post(`${API_BASE_URL}/users`, User, config)
      .then((res) => {
        console.log(res);
        setOpen(false);
        if (onSuccess) onSuccess();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" className="btn btn-success">+Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a User</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-white px-5 pt-3 pb-5">
          <form onSubmit={AddUser}>
            <div className="mb-2">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter Name"
                required
                onChange={(e) => {
                  setUser({ ...User, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter Email"
                required
                onChange={(e) => {
                  setUser({ ...User, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="phone">Phone:</label>
              <input
                type="number"
                name="phone"
                className={`form-control ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter Phone"
                required
                onChange={(e) => {
                  setUser({ ...User, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" className="btn btn-success m-2">Create</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn btn-primary m-2">
                Back
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Read User Modal Component
export const ReadUserModal = ({ userId, trigger }) => {
  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
          };
          const response = await axios.get(`${API_BASE_URL}/users/${userId}`, config);
          setDataUser(response.data);
          setError(null);
        } catch (err) {
          setError('Error fetching user details: ' + err.message);
          console.error('Error fetching user:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail of User</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-white px-5 pt-3 pb-5">
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
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
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn btn-primary">
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Update User Modal Component
export const UpdateUserModal = ({ userId, trigger, onSuccess }) => {
  const [User, setUser] = useState({});
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && userId) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      };
      axios
        .get(`${API_BASE_URL}/users/${userId}`, config)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [userId, open]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    // Name validation
    if (!User.name?.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!User.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(User.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!User.phone) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(User.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const UpdateUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    };
    axios.put(`${API_BASE_URL}/users/${userId}`, User, config)
      .then((res) => {
        setOpen(false);
        if (onSuccess) onSuccess();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update User {User.userName}</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-white px-5 pt-3 pb-5">
          <form onSubmit={UpdateUser}>
            <div className="mb-2">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                className={`form-control mb-2 ${errors.name ? 'border-red-500' : ''}`}
                value={User.name || ''}
                required
                onChange={(e) => {
                  setUser({ ...User, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'border-red-500' : ''}`}
                value={User.email || ''}
                required
                onChange={(e) => {
                  setUser({ ...User, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="phone">Phone:</label>
              <input
                type="number"
                name="phone"
                className={`form-control ${errors.phone ? 'border-red-500' : ''}`}
                value={User.phone || ''}
                required
                onChange={(e) => {
                  setUser({ ...User, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" className="btn btn-success m-2">Update</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn btn-primary m-2">
                Back
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
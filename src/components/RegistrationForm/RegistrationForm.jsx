import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { useNavigate } from "react-router-dom";

function RegistrationForm(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        userName: "",
        successMessage: null
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const sendDetailsToServer = () => {
        if (state.email.length && state.password.length) {
            props.showError(null);
            const payload = {
                "email": state.email,
                "phone":state.phone,
                "password": state.password,
                "name": state.userName
            }
            axios.post(`${API_BASE_URL}/users`, payload)
                .then(function (response) {
                    // Simulate token generation
                    const token = "dummy-token"; // Replace with actual logic if needed
                    localStorage.setItem(ACCESS_TOKEN_NAME, token);
                    setState(prevState => ({
                        ...prevState,
                        'successMessage': 'Registration successful. Redirecting to home page..'
                    }))
                    redirectToHome();
                    props.showError(null)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please enter valid username and password')
        }
    }

    const redirectToHome = () => {
        props.updateTitle('Home')
        navigate('/home');
    }

    const redirectToLogin = () => {
        props.updateTitle('Login')
        navigate('/login');
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer()
        } else {
            props.showError('Passwords do not match');
        }
    }

    return (
        <div className="content-wrapper">
            <div className="content-container">
                <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                    <form>
                        <div className="form-group text-left">
                            <div className="form-group text-left">
                                <div className="form-group text-left">  
                                <label htmlFor="exampleInputPassword1" className="mt-3" >User Name</label>
                                <input type="text"
                                    className="form-control"
                                    id="userName"
                                    placeholder="Add User Name"
                                    value={state.userName}
                                    onChange={handleChange}
                                />
                            </div>
                            <label htmlFor="exampleInputEmail1" className="mt-3" >Email address</label>
                            <input type="email"
                                className="form-control"
                                id="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={state.email}
                                onChange={handleChange}
                            />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <label htmlFor="exampleInputPhone1" className="mt-2" >Phone Number</label>
                            <input type="phone"
                                className="form-control"
                                id="phone"
                                placeholder="Enter phone number"
                                value={state.phone}
                                onChange={handleChange}
                            />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your phone number with anyone else.</small>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputPassword1" className="mt-2" >Password</label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={state.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputPassword1" className="mt-3" >Confirm Password</label>
                            <input type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={state.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary m-3"
                            onClick={handleSubmitClick}
                        >
                            Register
                        </button>
                    </form>
                    <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                        {state.successMessage}
                    </div>
                    <div className="mb-3">
                        <span>Already have an account? </span>
                        <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegistrationForm;
import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        
        // Remove any trailing slashes from the base URL
        const baseUrl = API_BASE_URL.replace(/\/+$/, '');
        
        // Add https protocol if not present (ngrok uses https by default)
        const fullUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
        
        // Add CORS headers to the request
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // Bypass ngrok browser warning
            }
        };
    
        axios.get(`${fullUrl}/users?email=${encodeURIComponent(state.email)}&password=${encodeURIComponent(state.password)}`, config)
            .then(function (response) {
                if (response.data.length > 0) {
                    const token = "dummy-token"; // Simulate token generation
                    localStorage.setItem(ACCESS_TOKEN_NAME, token);
                    setState(prevState => ({
                        ...prevState,
                        'successMessage': 'Login successful. Redirecting to home page..'
                    }))
                    props.setIsAuthenticated(true);
                    redirectToHome();
                    props.showError(null)
                } else {
                    props.showError("Email or password is invalid");
                }
            })
            .catch(function (error) {
                // Handle ngrok-specific errors
                if (error.response) {
                    props.showError(`Server error: ${error.response.status}`);
                } else if (error.request) {
                    props.showError("Unable to reach the server. Please check your ngrok connection.");
                } else {
                    props.showError("An error occurred during login.");
                }
            });
    }
    
    const redirectToHome = () => {
        props.updateTitle('Home')
        navigate('/home');
    }

    const redirectToRegister = () => {
        navigate('/register');
        props.updateTitle('Register');
    }

    return (
        <div className="content-wrapper">
          <div className="content-container">
                <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                    <form>
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputEmail1" className="mt-2">Email address</label>
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
                        <div className="form-group text-left">
                            <label htmlFor="exampleInputPassword1" className="mt-2">Password</label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={state.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-check">
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmitClick}
                        >Submit</button>
                    </form>
                    <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                        {state.successMessage}
                    </div>
                    <div className="registerMessage">
                        <span>Don't have an account? </span>
                        <span className="loginText" onClick={() => redirectToRegister()}>Register</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;
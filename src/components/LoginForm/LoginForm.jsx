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
        axios.get(`${API_BASE_URL}/users?email=${state.email}&password=${state.password}`)
            .then(function (response) {
                if (response.data.length > 0) {
                    const token = "dummy-token"; // Simulate token generation
                    localStorage.setItem(ACCESS_TOKEN_NAME, token);
                    // Continue with success message and redirection...
                    setState(prevState => ({
                        ...prevState,
                        'successMessage': 'Login successful. Redirecting to home page..'
                    }))
                    props.setIsAuthenticated(true);
                    redirectToHome();
                    props.showError(null)
                } else {
                    props.showError("Username and password do not match");
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
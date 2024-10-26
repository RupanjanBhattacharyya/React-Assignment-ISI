import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';

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
    const [showPassword, setShowPassword] = useState(false);

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
            // Add CORS headers to the request
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true' // Bypass ngrok browser warning
                }
            };
            axios.post(`${API_BASE_URL}/users`, payload,config)
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

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div class="wrapper">
            <div class="text-center mt-4 name">
                Authenticator
            </div>
            <form class="p-3 mt-3">
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus {
                    transition: background-color 0s 50000s;
                    -webkit-text-fill-color: inherit !important;
                }

                .password-toggle {
                    outline: none;
                    border: none;
                    background: none;
                }

                .password-toggle:focus {
                    outline: none;
                }
            `}</style>
                <div class="form-field d-flex align-items-center">
                    <span class="far fa-user"></span>
                    <input type="text"
                                id="userName"
                                placeholder="Add User Name"
                                value={state.userName}
                                onChange={handleChange}
                                autocomplete="username"
                            />
                    
                </div>
                <div class="form-field d-flex align-items-center">
                    <span class="far fa-user"></span>
                    <input type="email"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter Email"
                                        value={state.email}
                                        onChange={handleChange}
                                        autocomplete="email"
                                    />
                    
                </div>
                <div class="form-field d-flex align-items-center">
                    <span class="far fa-user"></span>
                    <input type="tel"
                                    id="phone"
                                    placeholder="Enter Phone Number"
                                    value={state.phone}
                                    onChange={handleChange}
                                    autocomplete="tel"
                                    />
                    
                </div>        
                <div class="form-field d-flex align-items-center">
                    <span class="fas fa-key"></span>
                                    <input type={showPassword ? "text" : "password"}                                      
                                        id="password"
                                        placeholder="Password"
                                        value={state.password}
                                        onChange={handleChange}
                                        autocomplete="new-password"
                                    />
                                    <button
                                    type="button"
                                    className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer m-2"
                                    onClick={togglePassword}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>                
                </div>
                <div class="form-field d-flex align-items-center">
                    <span class="fas fa-key"></span>
                                    <input type={showPassword ? "text" : "password"}                                      
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={state.password}
                                        onChange={handleChange}
                                        autocomplete="new-password"
                                    />
                                    <button
                                    type="button"
                                    className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer m-2"
                                    onClick={togglePassword}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>                
                </div>
                <button class="btn mt-3"
                        type="submit"
                        onClick={handleSubmitClick}
                        >Register
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
    )
}

export default RegistrationForm;
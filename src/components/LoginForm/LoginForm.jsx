import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';

function LoginForm(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: ""
    })
    const [showPassword, setShowPassword] = useState(false);

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
                        successMessage: 'Login successful. Redirecting to home page..'
                    }));
                    props.setIsAuthenticated(true);
                    props.showError(null);
                    
                    // Set timeout for 3 seconds before redirecting
                    setTimeout(() => {
                        redirectToHome();
                    }, 3000);
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

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div class="wrapper">
            <div class="text-center mt-4 name">
                Authenticator
            </div>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
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
                    position: relative;
                    right: 20px;
                }

                .password-toggle:focus {
                    outline: none;
                }
            `}</style>
                <div class="form-field d-flex align-items-center">
                    <span class="far fa-user"></span>
                    <input type="email"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter email"
                                        value={state.email}
                                        onChange={handleChange}
                                        autocomplete="email"
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
                                    className="password-toggle"
                                    onClick={togglePassword}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>                
                                </div>
                <button class="btn mt-3"
                        type="submit"
                        onClick={handleSubmitClick}
                        >Login
                </button>
            </form>
            <div className="registerMessage">
                <span>Don't have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span>
            </div>
        </div>
    
    )
}
export default LoginForm;
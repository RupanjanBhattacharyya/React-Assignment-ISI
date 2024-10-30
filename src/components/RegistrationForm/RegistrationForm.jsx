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
        successMessage: "",
        emailError: "",
        phoneError: "",
        passwordError: "",
        confirmPasswordError: "",
        userNameError: ""
    })
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value,
            [`${id}Error`]: ""
        }))
    }

    const sendDetailsToServer = () => {
        let isValid = true;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(state.email)) {
            setState(prevState => ({
                ...prevState,
                emailError: "Please enter a valid email address"
            }));
            isValid = false;
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(state.phone)) {
            setState(prevState => ({
                ...prevState,
                phoneError: "Please enter a valid 10-digit phone number"
            }));
            isValid = false;
        }

        // Validate password
        if (state.password.length < 8) {
            setState(prevState => ({
                ...prevState,
                passwordError: "Password must be at least 8 characters long"
            }));
            isValid = false;
        }

        // Validate confirm password
        if (state.password !== state.confirmPassword) {
            setState(prevState => ({
                ...prevState,
                confirmPasswordError: "Passwords do not match"
            }));
            isValid = false;
        }

        // Validate username
        if (state.userName.length < 3) {
            setState(prevState => ({
                ...prevState,
                userNameError: "Username must be at least 3 characters long"
            }));
            isValid = false;
        }

        if (isValid) {
            props.showError(null);
            const payload = {
                "email": state.email,
                "phone": state.phone,
                "password": state.password,
                "name": state.userName
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            };
            axios.post(`${API_BASE_URL}/users`, payload, config)
                .then(function (response) {
                    const token = "dummy-token";
                    localStorage.setItem(ACCESS_TOKEN_NAME, token);
                    setState(prevState => ({
                        ...prevState,
                        successMessage: 'Registration successful. Redirecting to login page..'
                    }));
                    // First timeout for clearing success message
                    setTimeout(() => {
                        setState(prevState => ({
                            ...prevState,
                            successMessage: ''
                        }));
                        // Second timeout for redirection, triggered after success message is cleared
                        setTimeout(() => {
                            redirectToLogin();
                            props.showError(null);
                        }, 100); // Small delay after clearing message before redirect
                    }, 3000);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please fix the errors in the form');
        }
    }

    const redirectToLogin = () => {
        props.updateTitle('Login')
        navigate('/login');
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        sendDetailsToServer();
    }

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div class="wrapper">
            <div class="text-center mt-4 name">
                Authenticator
            </div>
            {state.successMessage && (
                <div className="alert alert-success mt-2" style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '10px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px', 
                    margin: '10px 0',
                    fontWeight: '500'
                }}>
                    {state.successMessage}
                </div>
            )}
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
                    autocomplete="off"
                    required
                />
            </div>

            <div>
            {state.userNameError && (
                    <div className="font-bold text-red-500 text-sm mb-2 mt-n2" style={{ fontWeight: 'bold', color: 'red' , fontSize: '0.875rem', display: 'block', margin: '0.5rem 0 0'}}>{state.userNameError}</div>
                )}
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
                    required
                />
            </div>
            
            <div>
            {state.emailError && (
                    <div className="font-bold text-red-500 text-sm mb-2 mt-n2" style={{ fontWeight: 'bold', color: 'red' , fontSize: '0.875rem', display: 'block', margin: '0.5rem 0 0'}}>{state.emailError}</div>
                )}
            </div>

            <div class="form-field d-flex align-items-center">
                <span class="far fa-user"></span>
                <input type="tel"
                    id="phone"
                    placeholder="Enter Phone Number"
                    value={state.phone}
                    onChange={handleChange}
                    autocomplete="tel"
                    required
                />
            </div>

            <div>
            {state.phoneError && (
                    <div className="font-bold text-red-500 text-sm mb-2 mt-n2" style={{ fontWeight: 'bold', color: 'red' , fontSize: '0.875rem', display: 'block', margin: '0.5rem 0 0'}}>{state.phoneError}</div>
                )}
            </div>

            <div class="form-field d-flex align-items-center">
                <span class="fas fa-key"></span>
                <input type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                    required
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

            <div>
            {state.passwordError && (
                    <div className="font-bold text-red-500 text-sm mb-2 mt-n2" style={{ fontWeight: 'bold', color: 'red' , fontSize: '0.875rem', display: 'block', margin: '0.5rem 0 0'}}>{state.passwordError}</div>
                )}
            </div>

            <div class="form-field d-flex align-items-center">
                <span class="fas fa-key"></span>
                <input type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={state.confirmPassword}
                    onChange={handleChange}
                    required
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
            <div>
            {state.confirmPasswordError && (
                    <div className="font-bold text-red-500 text-sm mb-2 mt-n2" style={{ fontWeight: 'bold', color: 'red' , fontSize: '0.875rem', display: 'block', margin: '0.5rem 0 0'}}>{state.confirmPasswordError}</div>
                )}
            </div>
            
            <button class="btn mt-3"
                        type="submit"
                        onClick={handleSubmitClick}
                        >Register
                </button>
            </form>
            <div className="mb-3">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>         
        </div>
    )
}

export default RegistrationForm;
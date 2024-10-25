import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';

function Header(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    let title = capitalize(location.pathname.substring(1, location.pathname.length))
    if(location.pathname === '/') {
        title = 'Welcome'
    }

    function renderLogout() {
        if(location.pathname === '/home'){
            return(
                <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
            )
        }
    }

    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        navigate('/login')
        props.updateTitle('Login')
    }

    return(
        <nav className="navbar navbar-dark bg-primary">
            <div className="container-fluid">
                <div className="navbar-brand invisible">Placeholder</div>
                <span className="navbar-brand mb-0 h3 position-absolute justify-content-center start-50 translate-middle-x text-white">
                    {props.title || title}
                </span>
                <div className="ml-auto">
                    {renderLogout()}
                </div>
            </div>
        </nav>
    )
}

export default Header;
import React from 'react';
import { withRouter } from 'react-router-dom';

function Home(props) {

  const redirectToLogin = () => {
    props.updateTitle('Login')
    props.history.push('/login'); 
  };
  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    props.setIsAuthenticated(false);
    redirectToLogin();
  };

  return (
    <div className="mt-2">
      <h2>Welcome to the Home Page</h2>
      <p>You are authenticated!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default withRouter(Home);
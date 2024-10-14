import React from 'react';
import { withRouter } from 'react-router-dom';

function Home(props) {

  return (
    <div className="mt-2">
      <h2>Welcome to the Home Page</h2>
      <p>You are authenticated!</p>
    </div>
  );
}

export default withRouter(Home);
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import AlertComponent from './components/AlertComponent/AlertComponent'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
      <Header title={title}/>
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm setIsAuthenticated={setIsAuthenticated} showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/home"
              element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/home">
              <Home showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
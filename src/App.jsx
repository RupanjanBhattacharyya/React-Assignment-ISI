import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import AlertComponent from './components/AlertComponent/AlertComponent';
import Create from "./components/Create/Create";
import Update from "./components/Update/Update";
import Read from "./components/Read/Read";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        <Header title={title} updateTitle={updateTitle} />
            <Routes>
              <Route 
                path="/" 
                element={<RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />} 
              />
              <Route 
                path="/register" 
                element={<RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />} 
              />
              <Route 
                path="/login" 
                element={
                  <LoginForm 
                    setIsAuthenticated={setIsAuthenticated} 
                    showError={updateErrorMessage} 
                    updateTitle={updateTitle}
                  />
                } 
              />
              <Route 
                path="/home" 
                element={
                  isAuthenticated ? (
                    <Home 
                      setIsAuthenticated={setIsAuthenticated} 
                      showError={updateErrorMessage} 
                      updateTitle={updateTitle}
                    />
                  ) : (
                    <LoginForm 
                      setIsAuthenticated={setIsAuthenticated} 
                      showError={updateErrorMessage} 
                      updateTitle={updateTitle}
                    />
                  )
                } 
              />
              <Route path="/create" element={<Create />} />
              <Route path="/update/:id" element={<Update />} />
              <Route path="/read/:id" element={<Read />} />
            </Routes>
            <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
          </div>
    </BrowserRouter>
  );
}

export default App;
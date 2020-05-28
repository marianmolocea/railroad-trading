import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './frontend/Dashboard/Dashboard';
import Login from './frontend/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;

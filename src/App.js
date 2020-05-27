import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './frontend/Dashboard/Dashboard';
import Login from './frontend/Login/Login';
import BrokerAccountInput from './frontend/InputForms/BrokerAccountInput';
import PerformanceInput from './frontend/InputForms/PerformanceInput';
import AdminInput from './frontend/InputForms/AdminInput';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route
          exact
          path="/dashboard/account-details"
          component={BrokerAccountInput}
        />
        <Route
          exact
          path="/dashboard/app-settings"
          component={PerformanceInput}
        />
        <Route exact path="/dashboard/admin-settings" component={AdminInput} />
      </div>
    </Router>
  );
}

export default App;

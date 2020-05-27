import React from 'react';
import { NavLink } from 'react-router-dom';

const DashNav = () => {
  return (
    <div className="DashNav">
      <NavLink to="/dashboard/account-details">Account details</NavLink>
      <NavLink to="/dashboard/app-settings">App settings</NavLink>
      <NavLink to="/dashboard/admin-settings">Admin panel</NavLink>
    </div>
  );
};

export default DashNav;

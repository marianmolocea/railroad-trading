import React, { useState } from 'react';
import BrokerAccountInput from '../../InputForms/BrokerAccountInput';
import PerformanceInput from '../../InputForms/PerformanceInput';
import AdminInput from '../../InputForms/AdminInput';

const DashNav = () => {

  const [component, setComponent] = useState(<BrokerAccountInput />)

  return (
    <div className="DashNav">
      <button onClick={() => setComponent(<BrokerAccountInput />)}>Account details</button>
      <button onClick={() => setComponent(<PerformanceInput />)}>App settings</button>
      <button onClick={() => setComponent(<AdminInput />)}>Admin panel</button>
      {component}
    </div>
  );
};

export default DashNav;

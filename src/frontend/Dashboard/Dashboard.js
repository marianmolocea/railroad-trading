import React from 'react';
import BrokerAccountInput from '../InputForms/BrokerAccountInput';
import PerformanceInput from '../InputForms/PerformanceInput';
import AdminInput from '../InputForms/AdminInput';

export default function Dashboard() {
    return (
        <div className="Dashboard">
            Hello from Dashboard
            <BrokerAccountInput />
            <PerformanceInput />
            <AdminInput />
        </div>
    )
}

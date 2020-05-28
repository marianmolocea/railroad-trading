import React, { useState } from 'react';
import axios from 'axios';

const BrokerAccountInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountType, setAccountType] = useState('');

  const sendData = async () => {
    let data = {
      apiKey,
      accountId,
      accountType,
    };
    try {
      let response = await axios.post('http://localhost:3001/euj', data);
      console.log(response.status);

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="BrokerAccountInput">
      <div className="input-container">
        <label>API KEY:</label>
        <input
          name="apiKey"
          id="apiKey"
          placeholder="Your API KEY.."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <label>ACCOUNT ID:</label>
        <input
          name="accountId"
          id="accountId"
          placeholder="Your Account ID.."
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />
        <label>ACCOUNT TYPE:</label>
        <select
          name="accountType"
          id="accountType"
          placeholder="Account type:"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          required
        >
          <option value={'demo'}>DEMO</option>
          <option value={'live'}>LIVE</option>
        </select>
      </div>
      <button onClick={() => sendData()}>Save details</button>
    </div>
  );
};

export default BrokerAccountInput;

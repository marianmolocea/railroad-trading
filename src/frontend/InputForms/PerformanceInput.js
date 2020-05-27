import React from 'react';

const PerformanceInput = () => {
  return (
    <div className="PerformanceInput">
      <div className="input-container">
        <label>TIME FRAME:</label>
        <select defaultValue="m15">
          <option value="m5">M5</option>
          <option value="m15">M15</option>
          <option value="m30">M30</option>
          <option value="h1">H1</option>
          <option value="h4">H4</option>
          <option value="d1">D1</option>
        </select>
        <label>TAKE PROFIT TARGET:</label>
        <input
          type="number"
          placeholder="Profit target.."
          defaultValue={25}
        ></input>
      </div>
      <button>Save settings</button>
    </div>
  );
};

export default PerformanceInput;

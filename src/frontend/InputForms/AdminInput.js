import React from 'react';

const AdminInput = () => {
  return (
    <div className="AdminInput">
      <div className="input-container">
        <label>
          The MIN % difference between the body size of the candles:
        </label>
        <input
          type="number"
          value=""
          placeholder="Default value is 0.03"
          defaultValue={0.03}
        />
        <label>
          The MIN % difference between the total size of the candles:
        </label>
        <input
          type="number"
          value=""
          placeholder="Default value is 0.1"
          defaultValue={0.1}
        />
        <label>
          The MIN body size in pips of the candle to consider the pattern:
        </label>
        <input
          type="number"
          value=""
          placeholder="Default value is 3"
          defaultValue={3}
        />
        <label>
          The MIN pips over the MAX candle size to trigger the ORDER, TP & SL:
        </label>
        <input
          type="number"
          value=""
          placeholder="Default value is 2"
          defaultValue={2}
        />
      </div>
      <button>Save preference</button>
    </div>
  );
};

export default AdminInput;

import React, { useState } from 'react';

const GuardInput = ({ onSaveGuard }) => {
  const [guard, setGuard] = useState('');

  const handleGuardChange = (e) => {
    setGuard(e.target.value);
  };

  const handleSave = () => {
    onSaveGuard(guard);
  };

  return (
    <div className="guard-input-container">
      <input
        type="text"
        placeholder="Guard"
        value={guard}
        onChange={handleGuardChange}
        className="edge-input"
      />
      <button onClick={handleSave} className="save-button">
        Save
      </button>
    </div>
  );
};

export default GuardInput;

import React, { useState } from 'react';

const ActionInput = ({ onSaveAction }) => {
  const [actions, setAction] = useState([]);

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleSave = () => {
    onSaveAction(actions);
  };

  return (
    <div className="action-input-container">
      <input
        type="text"
        placeholder="Action"
        value={actions}
        onChange={handleActionChange}
        className="edge-input"
      />
      <button onClick={handleSave} className="save-button">
        Save
      </button>
    </div>
  );
};

export default ActionInput;

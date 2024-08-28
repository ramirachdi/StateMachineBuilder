import React, { useState } from 'react';
import '../../styles/state-nodes.css'; 
import { Handle } from 'react-flow-renderer';

const InitialState = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.label);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    data.onLabelChange(id, name);
    setIsEditing(false);
  };

  return (
    <div className={`state-node initial-state ${selected ? 'selected' : ''}`}>
      <div className="state-node-body">
      <Handle type="source" position="right" id="r"/>
      <Handle type="target" position="left" id="l"/>
      </div>
      <div className="state-node-text">
        {isEditing ? (
          <div className="state-node-edit">
            <input 
              type="text"
              value={name}
              onChange={handleNameChange}
              className="state-node-input"
            />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div className="state-node-label" onClick={() => setIsEditing(true)}>
            {name}
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialState;

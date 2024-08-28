import React, { useState } from 'react';
import '../../styles/state-nodes.css'; 
import { Handle } from 'react-flow-renderer';

const JoinNode = ({ id, data, selected }) => {
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
    <div className={`state-node join-node ${selected ? 'selected' : ''}`}>
      <div className="state-node-body">
        <Handle type="source" position="right" id="r"/>
        <Handle type="target" position="left" id="lt" style={{ top: '30%' }} />
        <Handle type="target" position="left" id="lb" style={{ top: '70%' }} />
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

export default JoinNode;

import React, { useState } from 'react';
import '../../styles/state-nodes.css'; 
import { Handle } from 'react-flow-renderer';

const ForkNode = ({ id, data, selected }) => {
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
    <div className={`state-node fork-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position="left" id="l"/>
      <Handle type="source" position="right" id="rt" style={{ top: '30%' }} />
      <Handle type="source" position="right" id="rb" style={{ top: '70%' }} />
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

export default ForkNode;

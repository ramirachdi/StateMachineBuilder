import React, { useState, useEffect } from 'react';
import '../../styles/state-nodes.css';
import { Handle } from 'react-flow-renderer';

const ChoiceNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.label || '');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    data.onLabelChange(id, name);
    setIsEditing(false);
  };

  useEffect(() => {
    setName(data.label || '');
  }, [data.label]);

  return (
    <div className={`state-node choice-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position="left" id= "l"style={{ top: '0%' }} />
      <Handle type="source" position="top" id="t" style={{ left: '100%' }} />
      <Handle type="source" position="bottom" id="b" style={{ left: '0%' }} />
      <Handle type="source" position="right" id="r" style={{ top: '100%' }} />

      <div className="state-node-edit">
        {isEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={handleChange}
              className="state-node-input"
            />
            <button onClick={handleSave} className="state-node-save-button">Save</button>
          </>
        ) : (
          <div className="state-node-text" onClick={() => setIsEditing(true)}>
            {name || 'Click to edit'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoiceNode;

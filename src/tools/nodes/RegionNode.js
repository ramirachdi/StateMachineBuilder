import React, { useState, useEffect } from 'react';
import '../../styles/state-nodes.css'; 
import { Handle } from 'react-flow-renderer';

const RegionNode = ({ id, data, selected }) => {
  const [name, setName] = useState(data.label);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    data.onLabelChange(id, name);
    setEditMode(false);
  };

  useEffect(() => {
    setName(data.label);
  }, [data.label]);

  return (
    <div className={`state-node region-node ${selected ? 'selected' : ''}`}>
      {editMode ? (
        <div className="state-node-edit">
          <input 
            type="text"
            value={name}
            onChange={handleChange}
            className="state-node-input"
          />
          <button onClick={handleSave} className="state-node-save-button">Save</button>
        </div>
      ) : (
        <div className="state-node-label" onClick={() => setEditMode(true)}>
          {name}
        </div>
      )}
      <button onClick={() => data.onEnterRegion(id)}>Enter</button>
      <Handle type="source" position="right" id="r"/>
      <Handle type="target" position="left" id="l"/>
    </div>
  );
};

export default RegionNode;

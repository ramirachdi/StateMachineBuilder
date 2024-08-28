import React, { useState } from 'react';
import '../../styles/CustomEdge.css';
import GuardInput from '../guards/GuardInput';
import ActionInput from '../actions/ActionInput';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data, style = {}, onSaveEdge, onSaveRegionEdge }) => {
  const [guard, setGuard] = useState(data.guard || '');
  const [actions, setActions] = useState(data.actions || []);
  const [event, setEvent] = useState(data.event || '');
  const [editMode, setEditMode] = useState(false);
  const [inputType, setInputType] = useState(null);
  const [edgeStyleType, setEdgeStyleType] = useState(data.styleType || 'step'); // Default edge style is 'step'

  const handleEdgeClick = () => {
    setEditMode(true);
    setInputType(null); // Reset input type when clicking on edge
  };

  const handleSaveGuard = (newGuard) => {
    setGuard(newGuard);
    const updatedData = { actions, guard: newGuard, event, styleType: edgeStyleType };
    if (onSaveEdge) {
      onSaveEdge(id, updatedData);
    } else {
      onSaveRegionEdge(id, updatedData);
    }
    setEditMode(false);
  };

  const handleSaveAction = (newAction) => {
    setActions((prevActions) => {
      const updatedActions = [...prevActions, newAction];
      const updatedData = { actions: updatedActions, guard, event };
      if (onSaveEdge) {
        onSaveEdge(id, updatedData);
      } else {
        onSaveRegionEdge(id, updatedData);
      }
      return updatedActions;
    });
    setEditMode(false);
  };


  const handleSaveEvent = (newEvent) => {
    setEvent(newEvent);
    const updatedData = { actions, guard, event: newEvent, styleType: edgeStyleType };
    if (onSaveEdge) {
      onSaveEdge(id, updatedData);
    } else {
      onSaveRegionEdge(id, updatedData);
    }
    setEditMode(false);
  };

  const handleEdgeStyleChange = (e) => {
    setEdgeStyleType(e.target.value);
    setEditMode(false);
  };

  const centerX = sourceX + (targetX - sourceX) / 2;
  const centerY = sourceY + (targetY - sourceY) / 2;

  // Calculate arrow points for the arrowhead
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const arrowLength = 10;
  const arrowPoints = `${targetX - arrowLength * Math.cos(angle - Math.PI / 6)},${targetY - arrowLength * Math.sin(angle - Math.PI / 6)} 
                      ${targetX},${targetY} 
                      ${targetX - arrowLength * Math.cos(angle + Math.PI / 6)},${targetY - arrowLength * Math.sin(angle + Math.PI / 6)}`;

  // Define different path styles
  const getPathData = (sourceX, sourceY, targetX, targetY, styleType) => {
    switch (styleType) {
      case 'bar':
        return `M${sourceX},${sourceY} L${sourceX},${targetY} L${targetX},${targetY}`;
      case 'step':
        return `M${sourceX},${sourceY} L${(sourceX + targetX) / 2},${sourceY} L${(sourceX + targetX) / 2},${targetY} L${targetX},${targetY}`;
      case 'concave':
        const controlX1 = sourceX + (targetX - sourceX) / 4;
        const controlX2 = sourceX + (3 * (targetX - sourceX)) / 4;
        return `M${sourceX},${sourceY} C${controlX1},${sourceY} ${controlX2},${targetY} ${targetX},${targetY}`;
      default:
        return `M${sourceX},${sourceY} L${targetX},${targetY}`;
    }
  };

  const pathData = getPathData(sourceX, sourceY, targetX, targetY, edgeStyleType);

  return (
    <>
      <path
        id={id}
        d={pathData}
        className="custom-edge-path"
        onClick={handleEdgeClick}
      />
      <polygon
        points={arrowPoints}
        className="custom-edge-arrow"
      />
      {editMode && (
        <foreignObject
          width={200}
          height={160} // Increase height to accommodate style selector
          x={centerX - 100}
          y={centerY - 80} // Adjust y position for center alignment
          className="edge-inputs"
        >
          <div className="edge-inputs-container">
            {inputType === 'guard' ? (
              <GuardInput onSaveGuard={handleSaveGuard} />
            ) : inputType === 'action' ? (
              <ActionInput onSaveAction={handleSaveAction} />
            ) : inputType === 'event' ? (
              <div>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="edge-input"
                />
                <button onClick={() => handleSaveEvent(event)} className="edge-input-button">Save</button>
              </div>
            ) : (
              <div>
                <button onClick={() => setInputType('guard')} className="edge-input-button">Add Guard</button>
                <button onClick={() => setInputType('action')} className="edge-input-button">Add Action</button>
                <button onClick={() => setInputType('event')} className="edge-input-button">Name Event</button>
                {/* Style Selector */}
                <div className="edge-style-selector">
                  <label>Edge Style:</label>
                  <select
                    value={edgeStyleType}
                    onChange={handleEdgeStyleChange}
                  >
                    <option value="default">Default</option>
                    <option value="bar">Bar</option>
                    <option value="step">Step</option>
                    <option value="concave">Concave</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </foreignObject>
      )}
      {/* Always display guard, action, and event */}
      <text x={centerX} y={centerY - 20} className="custom-edge-text">[GUARD] {guard}</text>
      <text x={centerX} y={centerY} className="custom-edge-text">{event}</text>
      {actions.map((action, index) => (
        <text key={index} x={centerX} y={centerY + 20 + (index * 20)} className="custom-edge-text">[ACTION] {action}</text>
      ))}

    </>
  );
};

export default CustomEdge;

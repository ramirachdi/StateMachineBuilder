import React from 'react';
import '../styles/toolbox.css'; 

const Toolbox = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="toolbox">
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'initialState')} draggable>
        Initial State
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'regularState')} draggable>
        Regular State
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'finalState')} draggable>
        Final State
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'choiceNode')} draggable>
        Choice Node
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'forkNode')} draggable>
        Fork Node
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'joinNode')} draggable>
        Join Node
      </div>
      <div className="toolbox-item" onDragStart={(event) => onDragStart(event, 'regionNode')} draggable>
        Region
      </div>
    </aside>
  );
};

export default Toolbox;


import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import RegularState from '../tools/nodes/RegularState';
import InitialState from '../tools/nodes/InitialState';
import FinalState from '../tools/nodes/FinalState';
import ChoiceNode from '../tools/nodes/ChoiceNode';
import ForkNode from '../tools/nodes/ForkNode';
import JoinNode from '../tools/nodes/JoinNode';
import RegionNode from '../tools/nodes/RegionNode';
import CustomEdge from '../tools/transitions/CustomEdge';

const nodeTypes = {
  regularState: RegularState,
  initialState: InitialState,
  finalState: FinalState,
  choiceNode: ChoiceNode,
  forkNode: ForkNode,
  joinNode: JoinNode,
  regionNode: RegionNode,
};

const defaultNodeWidth = 200;
const defaultNodeHeight = 150;

const RegionCanvas = ({
  regionId,
  previousRegionId,
  regionStates,
  updateRegionState,
  backToMainCanvas,
  backToPreviousRegion,
  updateRegionData,
  enterAnotherRegion
}) => {

  const { nodes: initialNodes = [], edges: initialEdges = [] } = regionStates[regionId] || {};
  const [regionNodes, setRegionNodes, onNodesChange] = useNodesState(initialNodes);
  const [regionEdges, setRegionEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const { nodes = [], edges = [] } = regionStates[regionId] || {};
    setRegionNodes(nodes);
    setRegionEdges(edges);
  }, [regionId, regionStates, setRegionEdges, setRegionNodes]);

  const onSaveRegionEdge = useCallback((id, data) => {
    setRegionEdges((edges) => {
      const updatedEdges = edges.map((edge) =>
        edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
      );

      updateRegionData(regionId, [], updatedEdges);
      return updatedEdges;
    });
  }, [setRegionEdges, updateRegionData, regionId]);

  const edgeTypes = useMemo(() => ({
    custom: (props) => <CustomEdge {...props} onSaveRegionEdge={onSaveRegionEdge} />,
  }), [onSaveRegionEdge]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'custom',
        id: `${params.source}-${params.target}-${+new Date()}`,
        data: { action: '', guard: '' }
      };

      setRegionEdges((prevEdges) => {
        const updatedEdges = addEdge(newEdge, prevEdges);

        return updatedEdges;
      });
      updateRegionState(regionId, [], [newEdge]);

    },
    [regionId, setRegionEdges, updateRegionState]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactflowType = event.dataTransfer.getData('application/reactflow');
      if (!reactflowType) return;

      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${reactflowType}-${+new Date()}`,
        type: reactflowType,
        position,
        data: {
          label: `${reactflowType.charAt(0).toUpperCase() + reactflowType.slice(1)}`,
          width: defaultNodeWidth,
          height: defaultNodeHeight,
          onLabelChange: (id, newLabel) => {
            setRegionNodes((nds) => {
              const updatedNodes = nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
              );
              updateRegionData(regionId, updatedNodes, []);
              return updatedNodes;
            });
          },
          onEnterRegion: () => enterAnotherRegion(newNode.id),
        },
      };

      setRegionNodes((prevNodes) => [...prevNodes, newNode]);

      updateRegionState(regionId, [newNode], []);
      // console.log(regionStates)
    },
    [regionId, setRegionNodes, updateRegionState, enterAnotherRegion, updateRegionData]
  );

  const handleNodeDragStop = useCallback(
    (event, node) => {
      setRegionNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
      updateRegionData(regionId, regionNodes, regionEdges);
    },
    [setRegionNodes, regionId, regionNodes, regionEdges, updateRegionData]
  );

  return (
    <div style={{ height: '100vh' }}>
      <button onClick={backToPreviousRegion} disabled={!previousRegionId}>Back to Previous Region</button>
      <button onClick={backToMainCanvas}>Back to Main Canvas</button>
      <ReactFlow
        key={`region-${regionId}`}
        nodes={regionNodes}
        edges={regionEdges.map((edge) => ({
          ...edge,
          id: edge.id || `${edge.source}-${edge.target}-${edge.type}-${+new Date()}`,
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ width: '100%', height: '90%' }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default RegionCanvas;

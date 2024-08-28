import React, { useState, useCallback, useMemo } from 'react';
import dagre from 'dagre';
import yaml from 'js-yaml';
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
import RegionCanvas from './RegionCanvas';
import YAMLGenerator from '../tools/yaml/YAMLGenerator';

const nodeTypes = {
  regularState: RegularState,
  initialState: InitialState,
  finalState: FinalState,
  choiceNode: ChoiceNode,
  forkNode: ForkNode,
  joinNode: JoinNode,
  regionNode: RegionNode,
};

const initialNodes = [];
const initialEdges = [];
const defaultNodeWidth = 200;
const defaultNodeHeight = 150;

const Canvas = () => {
  const [MainName, setMainName] = useState('');
  const mainCanvasId = `${MainName}`;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isMainCanvas, setIsMainCanvas] = useState(true);
  const [regionStack, setRegionStack] = useState([]);
  const [regionStates, setRegionStates] = useState({});
  const [mainCanvasName, setMainCanvasName] = useState('');
  const [allRegionIds, setAllRegionIds] = useState([]);

  const updateRegionState = useCallback((id, newNodes, newEdges) => {
    setRegionStates((prev) => {
      const existingNodes = prev[id]?.nodes || [];
      const existingEdges = prev[id]?.edges || [];
  
      // Filter out empty nodes and edges
      const filteredNewNodes = newNodes.filter(node => node && Object.keys(node).length > 0);
      const filteredNewEdges = newEdges.filter(edge => edge && Object.keys(edge).length > 0);
  
      const mergedNodes = [...existingNodes, ...filteredNewNodes];
      const mergedEdges = [...existingEdges, ...filteredNewEdges];
  
      return {
        ...prev,
        [id]: {
          nodes: mergedNodes,
          edges: mergedEdges,
        },
      };
    });
  }, []);

  const updateRegionData = useCallback((id, newNodes = [], newEdges = []) => {
    setRegionStates((prev) => {
      const existingNodes = prev[id]?.nodes || [];
      const existingEdges = prev[id]?.edges || [];
  
      const updatedNodes = newNodes.length > 0 ? newNodes : existingNodes;
      const updatedEdges = newEdges.length > 0 ? newEdges : existingEdges;
  
      return {
        ...prev,
        [id]: {
          nodes: updatedNodes,
          edges: updatedEdges,
        },
      };
    });
  }, []);

  const enterRegion = useCallback((id) => {
    setRegionStack((stack) => [...stack, id]);
    setAllRegionIds((ids) => ids.includes(id) ? ids : [...ids, id]);
    setIsMainCanvas(false);
    console.log(id)
  }, []);

  const enterAnotherRegion = useCallback((id) => {
    setRegionStack((stack) => [...stack, id]);
    setAllRegionIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  }, []);

  const backToPreviousRegion = useCallback(() => {
    setRegionStack((stack) => {
      const newStack = [...stack];
      newStack.pop(); // Remove current region ID
      return newStack;
    });
  }, []);

  const backToMainCanvas = () => {
    setIsMainCanvas(true);
    console.log(regionStack);
    setRegionStack([]);
  };

  const onConnect = useCallback(
    (params) => {
      // Generate a unique ID for the edge
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}-${+new Date()}`,
        type: 'custom',
        data: { actions: [], guard: '' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  
  const onLabelChange = useCallback((id, newLabel, regionId) => {
    if (regionId) {
      setRegionStates((prev) => {
        const updatedRegionStates = { ...prev };
        if (updatedRegionStates[regionId]) {
          updatedRegionStates[regionId] = {
            ...updatedRegionStates[regionId],
            nodes: updatedRegionStates[regionId].nodes.map((node) =>
              node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
            ),
          };
        }
        return updatedRegionStates;
      });
    } else {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            if (node.type === 'RegionNode') {
              return {
                ...node,
                id: newLabel,
                data: {
                  ...node.data,
                  label: newLabel,
                  onEnterRegion: () => enterRegion(newLabel),
                },
              };
            } else {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                },
              };
            }
          }
          return node;
        })
      );
  
      setRegionStates((prev) => {
        const updatedRegionStates = { ...prev };
  
        if (prev[id]) {
          updatedRegionStates[newLabel] = { ...prev[id] };
          delete updatedRegionStates[id];
        }
  
        return updatedRegionStates;
      });

    }
  }, [setNodes, setRegionStates, enterRegion]);
  
  const onSaveEdge = useCallback((id, data) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
      )
    );
  }, [setEdges]);

  const edgeTypes = useMemo(() => ({
    custom: (props) => <CustomEdge {...props} onSaveEdge={onSaveEdge} />,
  }), [onSaveEdge]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

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
  
      const tempId = `${reactflowType}-${+new Date()}`;
      const initialLabel = reactflowType === 'regionNode' ? 'Region' : `${reactflowType.charAt(0).toUpperCase() + reactflowType.slice(1)}`;
  
      const newNode = {
        id: tempId,
        type: reactflowType,
        position,
        data: {
          label: initialLabel,
          width: defaultNodeWidth,
          height: defaultNodeHeight,
          onLabelChange,
          onEnterRegion: reactflowType === 'regionNode' ? () => enterRegion(initialLabel) : undefined,
        },
      };
  
      setNodes((prevNodes) => [...prevNodes, newNode]);
  
      if (reactflowType === 'regionNode') {
        setRegionStates((prev) => ({
          ...prev,
          [initialLabel]: { nodes: [], edges: [] },
        }));
      }
    },
    [setNodes, onLabelChange, enterRegion, setRegionStates]
  );
  
  const handleNodeDragStop = useCallback((event, node) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      )
    );
  }, [setNodes]);

  const handleSaveName = () => {
    setMainName(mainCanvasName);
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const yamlContent = e.target.result;
        try {
          const stateMachineData = yaml.load(yamlContent);
  
          const mainStateMachine = stateMachineData?.['package-element']?.['state-machines']?.[0];
          const mainName = mainStateMachine?.name || '';
          setMainName(mainName);
  
          const mainRegionId = `${mainName}Region`;
  
          const states = mainStateMachine?.states || [];
          const transitions = mainStateMachine?.transitions || [];
  
          const mainCanvasNodes = [];
          const mainCanvasEdges = [];
          const regionData = {};
          const existingRegionIds = new Set();
  
          const pseudoStateKindMap = {
            CHOICE: 'choiceNode',
            INITIAL: 'initialState',
            FINAL: 'finalState',
            FORK: 'forkNode',
            JOIN: 'joinNode',
            REGULAR: 'regularState',
            REGION: 'regionNode',
          };
  
          const nodeNameToIdMap = {};
          const nodeIdToRegionIdMap = {};
  
          states.forEach((state) => {
            let { id, name, type, parentState, regionId, pseudoStateKind, position } = state;
  
            if (!id) {
              id = `${name}-${+new Date()}`;
            }
  
            if (!pseudoStateKind) {
              pseudoStateKind = 'REGULAR';
            }
  
            if (!type && pseudoStateKind) {
              type = pseudoStateKindMap[pseudoStateKind] || 'regularState';
            }
  
            nodeNameToIdMap[name] = id;
            nodeIdToRegionIdMap[id] = regionId;
  
            if (regionId && regionId !== mainRegionId && !existingRegionIds.has(regionId)) {
              existingRegionIds.add(regionId);
            }
  
            const node = {
              id,
              name,
              type: type || '',
              regionId,
              parentState,
              position: position || { x: 0, y: 0 },
              data: {
                label: name,
                width: defaultNodeWidth,
                height: defaultNodeHeight,
                pseudoStateKind,
                onLabelChange,
                onEnterRegion: () => enterRegion(name),
              },
            };
  
            if (regionId === mainRegionId || !regionId) {
              mainCanvasNodes.push(node);
            } else {
              if (!regionData[regionId]) {
                regionData[regionId] = { nodes: [], edges: [] };
              }
              regionData[regionId].nodes.push(node);
            }
          });
  
          transitions.forEach((transition) => {
            let { id, source, target, guard, actions, event, regionId } = transition;
  
          // Normalize actions to be an array
          if (!Array.isArray(actions)) {
            actions = actions ? [actions] : [];
          }

            const sourceId = nodeNameToIdMap[source];
            const targetId = nodeNameToIdMap[target];
  
            if (!regionId && sourceId) {
              regionId = nodeIdToRegionIdMap[sourceId];
            }
  
            if (!id) {
              id = `${sourceId || source}-${targetId || target}-${+new Date()}`;
            }
  
            const edge = {
              id,
              source: sourceId || source,
              target: targetId || target,
              type: 'custom',
              data: { actions, guard, event },
              kind: "EXTERNAL"
            };
  
            if (regionId === mainRegionId || !regionId) {
              mainCanvasEdges.push(edge);
            } else {
              if (!regionData[regionId]) {
                regionData[regionId] = { nodes: [], edges: [] };
              }
              regionData[regionId].edges.push(edge);
            }
          });
  
          const layoutGraph = (nodes, edges, nodeSep = 250, rankSep = 300, edgeLabelSpace = 300) => {
            const dagreGraph = new dagre.graphlib.Graph();
            dagreGraph.setDefaultEdgeLabel(() => ({}));
            dagreGraph.setGraph({ rankdir: 'LR', nodesep: nodeSep, ranksep: rankSep });
          
            const nodeWidth = defaultNodeWidth;
            const nodeHeight = defaultNodeHeight;
          
            nodes.forEach((node) => {
              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
            });
          
            edges.forEach((edge) => {
              dagreGraph.setEdge(edge.source, edge.target);
            });
          
            dagre.layout(dagreGraph);
          
            nodes.forEach((node) => {
              const nodeWithPosition = dagreGraph.node(node.id);
              if (nodeWithPosition) {
                node.position = {
                  x: nodeWithPosition.x - nodeWidth / 2,
                  y: nodeWithPosition.y - nodeHeight / 2,
                };
              } else {
                console.warn(`Dagre did not compute a position for node ${node.id}`);
                node.position = { x: 0, y: 0 };
              }
            });
          
            edges.forEach((edge) => {
              const edgeWithPosition = dagreGraph.edge(edge.source, edge.target);
              if (edgeWithPosition) {
                edge.positions = {
                  sourceX: edgeWithPosition.points[0].x,
                  sourceY: edgeWithPosition.points[0].y,
                  targetX: edgeWithPosition.points[edgeWithPosition.points.length - 1].x,
                  targetY: edgeWithPosition.points[edgeWithPosition.points.length - 1].y,
                };
                edge.labelPosition = {
                  x: (edgeWithPosition.points[0].x + edgeWithPosition.points[edgeWithPosition.points.length - 1].x) / 2,
                  y: (edgeWithPosition.points[0].y + edgeWithPosition.points[edgeWithPosition.points.length - 1].y) / 2 - edgeLabelSpace,
                };
              } else {
                console.warn(`Dagre did not compute a position for edge from ${edge.source} to ${edge.target}`);
              }
            });
          };
          
          
  
          layoutGraph(mainCanvasNodes, mainCanvasEdges);
  
          existingRegionIds.forEach((regionId) => {
            if (!mainCanvasNodes.find(node => node.name === regionId)) {
              const newRegionNode = {
                id: regionId,
                name: regionId,
                type: 'regionNode',
                regionId,
                position: { x: 0, y: 0 },
                data: {
                  label: regionId,
                  width: defaultNodeWidth,
                  height: defaultNodeHeight,
                  pseudoStateKind: 'REGION',
                  onLabelChange,
                  onEnterRegion: () => enterRegion(regionId),
                },
              };
  
              if (!mainCanvasNodes.find(node => node.id === newRegionNode.id)) {
                mainCanvasNodes.push(newRegionNode);
              }
            }
          });
  
          setNodes(mainCanvasNodes);
          setEdges(mainCanvasEdges);
  
          for (const [regionId, data] of Object.entries(regionData)) {
            layoutGraph(data.nodes, data.edges);
            updateRegionState(regionId, data.nodes, data.edges);
          }
  
          setAllRegionIds(Object.keys(regionData));
  
        } catch (error) {
          console.error('Error parsing YAML:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  

  
  
  return (
    <div className="reactflow-wrapper" style={{ height: '100vh' }}>

      {isMainCanvas ? (
        <>
          <div style={{ padding: '10px', background: '#f4f4f4' }}>
            <label>
              <input 
                type="text" 
                value={mainCanvasName} 
                onChange={(e) => setMainCanvasName(e.target.value)} 
                placeholder="Enter main canvas name" 
              />
            </label>
            <button onClick={handleSaveName} style={{ marginLeft: '10px' }}>
              Save Name
            </button>
            {MainName && <div style={{ marginTop: '10px' }}>{MainName}</div>}

            <input type="file" accept=".yaml, .yml" onChange={handleFileUpload} />

          </div>
          <YAMLGenerator 
            nodes={nodes} 
            edges={edges} 
            regionStates={regionStates} 
            allRegionIds={allRegionIds} 
            mainCanvasId={mainCanvasId}
            MainName={MainName}
            regionId={regionStack[regionStack.length - 1]}
            previousRegionId={regionStack.length > 1 ? regionStack[regionStack.length - 2] : mainCanvasId}
          />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeDragStop={handleNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            style={{ width: '100%', height: '100vh' }}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </>
      ) : (
        <RegionCanvas
          regionId={regionStack[regionStack.length - 1]}
          previousRegionId={regionStack.length > 1 ? regionStack[regionStack.length - 2] : null}
          regionStates={regionStates}
          updateRegionState={updateRegionState}
          backToMainCanvas={backToMainCanvas}
          backToPreviousRegion={backToPreviousRegion}
          enterAnotherRegion={enterAnotherRegion}
          updateRegionData={updateRegionData}
        />
      )}
    </div>
  );
};

export default Canvas;

import React, { useCallback, useMemo } from 'react';
import yaml from 'js-yaml';

const YAMLGenerator = ({ nodes = [], edges = [], regionStates = {}, allRegionIds = [], MainName, mainCanvasId }) => {
  mainCanvasId = mainCanvasId+'Region';
  // Memoize the pseudoStateKindMap
  const pseudoStateKindMap = useMemo(() => ({
    choiceNode: 'CHOICE',
    initialState: 'INITIAL',
    finalState: 'FINAL',
    forkNode: 'FORK',
    joinNode: 'JOIN',
    regularState: 'REGULAR',
    regionNode: 'REGION',
  }), []);

  // Create a map from node ID to node name for all main canvas nodes
  const nodeIdToNameMap = useMemo(() => {
    const map = {};
    nodes.forEach(node => {
      map[node.id] = node.data.label;
    });
    return map;
  }, [nodes]);

  // Helper function to traverse regions
  const traverseRegion = useCallback((regionId, parentRegionId) => {
    const region = regionStates[regionId];
    if (!region) {
      console.error(`Region with ID ${regionId} not found in regionStates.`);
      return { nodes: [], edges: [] };
    }

    const { nodes: regionNodes = [], edges: regionEdges = [] } = region;
    const regionData = {
      nodes: regionNodes.map((node) => {
        // Update the nodeIdToNameMap with the region node
        nodeIdToNameMap[node.id] = node.data?.label || '';
        return {
          name: node.data?.label || '',
          parentState: parentRegionId || '',
          regionId: regionId || '',
          pseudoStateKind: pseudoStateKindMap[node.type] || 'UNKNOWN',
        };
      }),
      edges: regionEdges.map((edge) => ({
        event: edge.data.event || '',
        source: nodeIdToNameMap[edge.source] || '',
        target: nodeIdToNameMap[edge.target] || '',
        guard: edge.data.guard || '',
        actions: edge.data.actions ? edge.data.actions : '',
        kind: "EXTERNAL"
      })),
    };

    const nestedRegions = regionNodes
      .filter((node) => node.type === 'regionNode')
      .map((node) => traverseRegion(node.id, regionId)); // Pass the current regionId as parentRegionId for nested regions

    return {
      nodes: [...regionData.nodes, ...nestedRegions.flatMap(nested => nested.nodes)],
      edges: [...regionData.edges, ...nestedRegions.flatMap(nested => nested.edges)]
    };
  }, [regionStates, pseudoStateKindMap, nodeIdToNameMap]);

  const generateYAML = useCallback(() => {
    if (!nodes.length || !edges.length) {
      console.error('Nodes or edges array is empty.');
      return;
    }

    console.log('Generating YAML with main canvas nodes:', nodes);
    console.log('Generating YAML with main canvas edges:', edges);
    console.log('Generating YAML with region states:', regionStates);

    const stateMachineData = {
      'package-element': {
        'state-machines': [
          {
            name: MainName,
            states: [
              ...nodes.map((node) => ({
                name: node.data?.label || '',
                parentState: '',
                regionId: mainCanvasId || '',
                pseudoStateKind: pseudoStateKindMap[node.type] || 'UNKNOWN',
              })),
              ...allRegionIds.flatMap((regionId) => traverseRegion(regionId, mainCanvasId).nodes)
            ],
            transitions: [
              ...edges.map((edge) => ({
                event: edge.data.event || '',
                source: nodeIdToNameMap[edge.source] || '',
                target: nodeIdToNameMap[edge.target] || '',
                guard: edge.data.guard || '',
                actions: edge.data.actions ? edge.data.actions : '',
                kind: "EXTERNAL"
              })),
              ...allRegionIds.flatMap((regionId) => traverseRegion(regionId, mainCanvasId).edges)
            ],
          },
        ],
      },
    };

    try {
      const yamlData = yaml.dump(stateMachineData);
      downloadYAMLFile(yamlData);
    } catch (error) {
      console.error('Error generating YAML:', error);
    }
  }, [nodes, edges, regionStates, MainName, mainCanvasId, traverseRegion, pseudoStateKindMap, allRegionIds, nodeIdToNameMap]);

  const downloadYAMLFile = (yamlData) => {
    const blob = new Blob([yamlData], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state_machine.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={generateYAML}>Generate YAML</button>
    </div>
  );
};

export default YAMLGenerator;

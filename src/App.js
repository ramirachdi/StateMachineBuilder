import React from 'react';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';

const App = () => {
  return (
    <div className="app">
      <Toolbox />
      <Canvas />  
    </div>
  );
};

export default App;

import React from 'react';
import { FeatureType } from '../electron/myide/entity/feature';
import { AlertType } from './components/Alert';
import AlertQueue from './components/AlertQueue';

function App() {

  return (
    <div className="App">
     <h1>Hello World</h1>
     <AlertQueue />
    </div>
  );
}

export default App;

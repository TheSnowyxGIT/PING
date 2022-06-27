import React from 'react';
import { Project } from './classes/Project';
import AlertQueue from './components/AlertQueue';

function App() {

  const project = new Project("C:\\Users\\Adrien\\Desktop\\testcratesio\\testtttes")
  console.log(project.rootName)

  return (
    <div className="App">
     <h1>Hello World</h1>
     <AlertQueue />
    </div>
  );
}

export default App;

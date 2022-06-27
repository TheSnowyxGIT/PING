import { type } from 'os';
import React from 'react';
import { FilesTree, NodeType } from './classes/FilesTree';
import { Project } from './classes/Project';
import AlertQueue from './components/AlertQueue';
import ProjectWindow from './components/ProjectWindow';
import {Tree} from './components/Tree';

const node4= new FilesTree("file2", [], NodeType.File);
const node3= new FilesTree("file1", [], NodeType.File); 
const node2 = new FilesTree("folder2", [node4], NodeType.Folder); 
const node1 = new FilesTree("folder1", [node2, node3],  NodeType.Folder);
const root = new FilesTree("root", [node1],  NodeType.Folder)


function App() {
    /*const project = new Project("C:\\Users\\Adrien\\Desktop\\testcratesio\\testtttes")
  console.log(project.rootName)*/
  return (
    <div className="App">
     <ProjectWindow projectName={'PING'} fileTree={root}/>
     <AlertQueue />
    </div>
  );
}

export default App;

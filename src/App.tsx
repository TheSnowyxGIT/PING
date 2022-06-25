import { type } from 'os';
import React from 'react';
import {Tree, FilesTree, NodeType} from './components/Tree';

const node4= new FilesTree("file2", [], NodeType.File);
const node3= new FilesTree("file1", [], NodeType.File); 
const node2 = new FilesTree("folder2", [node4], NodeType.Folder); 
const node1 = new FilesTree("folder1", [node2, node3],  NodeType.Folder);
const root = new FilesTree("root", [node1],  NodeType.Folder)

function App() {
  return (
    <div className="App">
     <Tree node={root}/>
    </div>
  );
}

export default App;

import { Tree } from "../components/Tree";
import { F_Node } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";
import { Report } from "../shared/report";


export class FileNode implements F_Node{
  public path: string;
  public type: NodeType;
  public children: FileNode[];
  public name: string;

  public static of(node: F_Node): FileNode{
    return node as FileNode;
}

  constructor(path: string, name: string, type: NodeType, children: FileNode[]) {
    this.path = path;
    this.name = name;
    this.type = type;
    this.children = children;

  }
  
  public getPath(hardPath: string, rootPath: string): string {
    let path : string= hardPath.substring(hardPath.indexOf(rootPath) + rootPath.length);
    return this.path; 
  }
  // add node to tree

  public getChild():FileNode
  {
    
  }

  public addNode(pah:string, node: F_Node): boolean {
    
    
    
    return true;
  }

}

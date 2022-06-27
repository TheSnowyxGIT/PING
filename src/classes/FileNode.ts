import { isNullishCoalesce } from "typescript";
import { Tree } from "../components/Tree";
import { F_Node } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";
import { Report } from "../shared/report";


export class FileNode implements F_Node{
  public path: string;
  public relativePath: string;
  public type: NodeType;
  public children: FileNode[];
  public name: string;

  public static of(node: F_Node): FileNode{
    return node as FileNode;
  }

  constructor(path: string, relativePath: string, name: string, type: NodeType, children: FileNode[]) {
    this.path = path;
    this.relativePath = relativePath;
    this.name = name;
    this.type = type;
    this.children = children;

  }

  public getChild(path: string[]): FileNode | null{
    for(const child of this.children)
    {
      if (path[0] === child.name)
      {
        if (path.length === 1)
          return child;
        else
        {
          path.shift();
          return this.getChild(path);
        }
      }
    }
    return null;
  }
  
  // add node to tree
  public addNode(node: F_Node): boolean {
    let path = node.relativePath.split(window.libraries.path.sep);
    path.pop();
    let parent = this.getChild(path);
    if (parent == null)
      return false;
    parent.children.push(FileNode.of(node));
    return true;
  }

}

import { F_Node } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";


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

}

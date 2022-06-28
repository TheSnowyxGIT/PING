import { isNullishCoalesce, textChangeRangeIsUnchanged } from "typescript";
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
  public parent: FileNode | null;

  public static of(node: F_Node): FileNode{
    return new FileNode(node.path, node.relativePath, node.name, node.type, node.children.map(child => FileNode.of(child)));
  }

  constructor(path: string, relativePath: string, name: string, type: NodeType, children: FileNode[]) {
    this.path = path;
    this.relativePath = relativePath;
    this.name = name;
    this.type = type;
    this.children = children;
    this.parent = null;
    this.loadParent(this.parent);
  }

  private loadParent(parent: FileNode | null){
    this.parent = parent;
    for (let child of this.children){
      child.loadParent(this);
    }
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
          return child.getChild(path);
        }
      }
    }
    return null;
  }
}

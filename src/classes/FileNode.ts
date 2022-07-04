import { F_Node } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";
import { Ide } from "./Ide";


export class FileNode implements F_Node{

  public static of(node: F_Node): FileNode{
    return new FileNode(node.path, node.relativePath, node.name, node.type, node.children.map(child => FileNode.of(child)));
  }

  // attributes
  public path: string;
  public relativePath: string;
  public type: NodeType;
  public children: FileNode[];
  public name: string;
  public parent: FileNode | null;

  // Constructor
  constructor(path: string, relativePath: string, name: string, type: NodeType, children: FileNode[]) {
    this.path = path;
    this.relativePath = relativePath;
    this.name = name;
    this.type = type;
    this.children = children;
    this.parent = null;
    this.loadParent(this.parent);
  }

  private loadParent(parent: FileNode | null, update: boolean = true){
    this.parent = parent;
    for (let child of this.children){
      child.loadParent(this, false);
    }
    // Update react
    update && Ide.getInstance().updateReact();
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

  // Remove in front
  public remove(update: boolean = true){
    // Remove him self from the current parent
    let parent = this.parent;
    if (parent !== null){
        let index = parent.children.map(child => child.name).indexOf(this.name);
        if (index >= 0)
            parent.children.splice(index, 1);
    }
    // Update react
    update && Ide.getInstance().updateReact();
  }

  public equals(node: FileNode): boolean{
    return this.relativePath === node.relativePath;
  }
}

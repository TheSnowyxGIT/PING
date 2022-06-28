import { F_Aspect, F_Node, F_Project } from "../shared/F_interfaces";
import { FileNode } from "./FileNode";

export class Project implements F_Project {
    public rootNode: FileNode;
    public aspects: F_Aspect[];

    public static of(project: F_Project): Project{
        return new Project(FileNode.of(project.rootNode), project.aspects);
    }

    constructor(rootNode: FileNode, aspects: F_Aspect[]){
        this.aspects = aspects;
        this.rootNode = rootNode;
    }

    // add node to tree
    public addNode(node: F_Node): boolean {
      let path = node.relativePath.split(window.libraries.path.sep);
      path.pop();
      let parent = this.rootNode.getChild(path);
      if (parent == null)
        return false;
      let newNode = FileNode.of(node);
      newNode.parent = parent;
      parent.children.push(newNode);
      return true;
    }
}

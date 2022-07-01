import AlertQueue from "../components/Alerts/AlertQueue";
import { F_Aspect, F_Node, F_Project } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";
import { FileEdit } from "./FileEdit";
import { FileNode } from "./FileNode";
import { Ide } from "./Ide";

export class Project implements F_Project {

  public static of(project: F_Project): Project{
    return new Project(FileNode.of(project.rootNode), project.aspects);
  }

    // attributes
    public rootNode: FileNode;
    public selectedNode: FileNode | null = null;
    public selectedFile: FileNode | null = null;
    public filesOpened: FileEdit[] = [];
    public aspects: F_Aspect[];

    // Constructor
    constructor(rootNode: FileNode, aspects: F_Aspect[]){
        this.aspects = aspects;
        this.rootNode = rootNode;
    }

    public async select(node: FileNode, update: boolean = true){
        this.selectedNode = node;
        if (node.type === NodeType.FILE){
          this.selectedFile = node;
        }
        await this.openFile(node, false);
        // update React
        update && Ide.getInstance().updateReact();
    }

    public unselect(update: boolean = true){
      this.selectedNode = null;
      // update React
      update && Ide.getInstance().updateReact();
  }

    public async openFile(node: FileNode, update: boolean = true) {
        if (node.type !== NodeType.FILE)
          return;
        // check already open
        if (!this.filesOpened.some(files => files.file.equals(node))){
          // Not opened
          let report = await window.project.getContentFile(node.relativePath)
          if (report.isSuccess){
            let data = report.data ? report.data : "";
            let fileEdit = new FileEdit(node, data);
            this.filesOpened.push(fileEdit);
            // update React
            update && Ide.getInstance().updateReact();
          } else {
            AlertQueue.showReport("Read file", report);
          }
        }
    }

    public closeFile(node: FileNode, update: boolean = true) {
      // check file opened
      let index = 0;
      for (let fileEdit of this.filesOpened){
        if (fileEdit.file.equals(node)){
          break;
        }
        index += 1;
      }
      if (index < this.filesOpened.length){
        this.filesOpened.splice(index, 1);
        if (this.selectedFile){
          if (this.selectedFile.equals(node)){
            if (this.filesOpened.length > 0){
              index = index - 1 < 0 ? 0 : index - 1;
              let node = this.filesOpened[index].file;
              this.select(node, false);
            } else {
              this.unselect(false);
            }
          }
        }
        // update React
        update && Ide.getInstance().updateReact();
      }
    }

    // add node to tree
    public addNode(node: F_Node, update: boolean = true): boolean {
      let path = node.relativePath.split(window.libraries.path.sep);
      path.pop();
      let parent = this.rootNode.getChild(path);
      if (parent == null)
        return false;
      let newNode = FileNode.of(node);
      newNode.parent = parent;
      parent.children.push(newNode);
      // update React
      update && Ide.getInstance().updateReact();
      return true;
    }
}

import { AlertType } from "../components/Alert";
import AlertQueue from "../components/AlertQueue";
import { F_Aspect, F_Node, F_Project } from "../shared/F_interfaces";
import { NodeType } from "../shared/ideEnums";
import { FileEdit } from "./FileEdit";
import { FileNode } from "./FileNode";

export class Project implements F_Project {
    public rootNode: FileNode;
    public selectedNode: FileNode | null = null;
    public selectedFile: FileNode | null = null;

    public filesOpened: FileEdit[] = [];

    public aspects: F_Aspect[];

    public static of(project: F_Project): Project{
        return new Project(FileNode.of(project.rootNode), project.aspects);
    }

    constructor(rootNode: FileNode, aspects: F_Aspect[]){
        this.aspects = aspects;
        this.rootNode = rootNode;
    }

    public setSelectedNode(node: FileNode | null){
      this.selectedNode = node;
      if (node && node.type === NodeType.FILE)
        this.selectedFile = node;
      if (!node)
        this.selectedFile = null;
    }

    public async openFile(node: FileNode) {
        if (node.type !== NodeType.FILE)
          return;
        // check alredy open
        if (!this.filesOpened.some(files => files.file.equals(node))){
          // Not opened
          console.log(node)
          let report = await window.electron.getContentFile(node.relativePath)
          if (report.isSuccess && report.data !== null && report.data !== undefined){
            let fileEdit = new FileEdit(node, report.data);
            this.filesOpened.push(fileEdit);
          } else {
            AlertQueue.sendAlert({type:AlertType.ERROR, time: 3000, title: "Read file", content: report.message || ""})
          }
        }
    }

    public closeFile(node: FileNode) {
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
            let node: FileNode | null = null;
            if (this.filesOpened.length > 0){
              index = index - 1 < 0 ? 0 : index - 1;
              node = this.filesOpened[index].file;
            }
            this.setSelectedNode(node);
          }
        }
      }
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

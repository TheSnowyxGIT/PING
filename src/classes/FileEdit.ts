import { NodeType } from "../shared/ideEnums";
import { FileNode } from "./FileNode";

/**
 * This class represent the state of a file in the editor
 */
export class FileEdit {

    public isModified = false;

    public file: FileNode;

    public content: string;

    constructor(file: FileNode, content: string){
        this.file = file;
        this.content = content;
    }

    
}

import { F_Aspect, F_Node, F_Project } from "../shared/F_interfaces";
import { FileNode } from "./FileNode";

export class Project implements F_Project {
    public rootNode: FileNode;
    public aspects: F_Aspect[];

    public static of(project: F_Project): Project{
        return project as Project
    }

    constructor(rootNode: FileNode, aspects: F_Aspect[]){
        this.aspects = aspects;
        this.rootNode = rootNode;
    }
}

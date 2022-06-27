import { AspectType } from "../../electron/myide/entity/aspect";
import { FilesTree } from "./FilesTree";

export class Project {
    public path: string;
    public rootName: string;
    public aspects: AspectType[];
    public files: FilesTree;

    constructor(path: string, rootName: string, aspects: AspectType[], files: FilesTree){
        this.path = path;
        this.rootName = rootName;
        this.aspects = aspects;
        this.files = files;
    }
}

import { AspectType } from "../../electron/myide/entity/aspect";

export class Project {
    public path: string;
    public rootName: string;
    public aspects: AspectType[];

    constructor(path: string, rootName: string, aspects: AspectType[]){
        this.path = path;
        this.rootName = rootName;
        this.aspects = aspects
    }
}

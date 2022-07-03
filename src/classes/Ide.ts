import { Project } from "./Project";

export class Ide {

    // Singleton
    private static instance: Ide | null = null;
    public static getInstance(): Ide {
        if (!Ide.instance)
            throw new Error("Ide instance null");
        return Ide.instance;
    }

    // specials attributes
    public updateReact: () => void = () => {};
    // attributes
    public opened_project: Project | null = null;

    // Constructor
    constructor(updateReact: () => void){
        if (Ide.instance){
            return Ide.instance;
        }
        this.updateReact = updateReact;
        Ide.instance = this;
    }

    public setProject(project: Project, update: boolean = true){
        this.opened_project = project;
        update && this.updateReact();
    }

}

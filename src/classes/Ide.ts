import { Project } from "./Project";

export class Ide {

    public opened_project: Project | null = null;


    public setProject(newProject: Project){
        this.opened_project = newProject;
    }

}

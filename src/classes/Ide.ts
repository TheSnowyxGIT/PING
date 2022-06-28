import { Project } from "./Project";

export class Ide {

    private opened_project: Project | null = null;

    public HasProjectOpened(): boolean {
        return this.getOpenedProject() !== null;
    }

    public getOpenedProject(): Project | null {
        return this.opened_project;
    };

    public setProject(newProject: Project){
        this.opened_project = newProject;
    }

}

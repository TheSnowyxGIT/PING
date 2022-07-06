import TerminalWindow from "../components/Terminal/TerminalWindow";
import { CategoryMenu } from "./CategoryMenu";
import { FeatureExecutor } from "./FeatureExecutor";
import { AspectType } from "../shared/ideEnums";
import { CratesManager } from "./CratesManager";
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
    public categoryMenu = new CategoryMenu();
    public featureExecutor = new FeatureExecutor();
    // init component
    private terminalWindow = new TerminalWindow({});
    public cratesManager = new CratesManager();

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
        project.aspects.forEach(el => {
        console.log("project.aspects: " + el.type);
        })
       // if (project.aspects.some( element => {return element.type === AspectType.CARGO})){
        CratesManager.getInstance().getDependenciesFromBack();
      //  }
        update && this.updateReact();
    }

}

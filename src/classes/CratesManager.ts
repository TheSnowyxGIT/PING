import { crash } from "process";
import { Ide } from "./Ide";

interface DependencyData {
    id: string
    version: string
}

export class CratesManager
{
     // Singleton
     private static instance: CratesManager | null = null;
     public static getInstance(): CratesManager {
        if (!CratesManager.instance)
            throw new Error("CratesManager instance null");
        return CratesManager.instance;
    }

    
    private installedDependencies: DependencyData[] = [];
    
    constructor() {
        if (CratesManager.instance){
            return CratesManager.instance;
        }
        CratesManager.instance = this;
    }

    getInstalledDependencies() {
        return this.installedDependencies;
    }

    addInstalledDependency(dependency: DependencyData) {
        this.installedDependencies.push(dependency);
        Ide.getInstance().updateReact();
    }
}

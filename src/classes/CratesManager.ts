import { version } from "os";
import { crash, report } from "process";
import { F_Dependency, FeatureFrontParams} from "../shared/F_interfaces";
import { FeatureType } from "../shared/ideEnums";
import { Ide } from "./Ide";

interface DependencyData {
    id: string
    version: string
}

export class CratesManager {
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

    getDependenciesFromBack(update: boolean = false) {
        window.features.execFeature<null, F_Dependency[]>(FeatureType.CRATES_GET_DEPENDENCIES, { params: null }).then(report => {
            if (report.isSuccess && report.data != null) {
                this.installedDependencies = report.data.map(dep => {
                    return {
                        id: dep.id,
                        version: dep.version
                    }
                })
                update && Ide.getInstance().updateReact();
            }
        })
    }

    getInstalledDependencies() {
        return this.installedDependencies;
    }

    addInstalledDependency(dependency: F_Dependency) {
        window.features.execFeature<F_Dependency, null>(FeatureType.CRATE_INSTALL_DEPENDENCY, { params:  dependency})
                        .then( report => {
                            if (report.isSuccess)
                                this.installedDependencies.push(dependency);
                            Ide.getInstance().updateReact();
                        })
    }
}


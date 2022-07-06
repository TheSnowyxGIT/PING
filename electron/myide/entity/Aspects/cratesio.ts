import { CratesService } from "../../services/cratesService";
import { resolve } from "path";
import { F_Dependency } from "../../../../src/shared/F_interfaces";
import { AspectType, FeatureType } from "../../../../src/shared/ideEnums";
import { Report } from "../../../../src/shared/report";
import { exists_script, run_script } from "../../../utils/runScripts";
import { Aspect_ } from "../aspect";
import { FeatureParams, Feature_ } from "../feature";
import { MyProject } from "../project";
import { version } from "os";
import { stringify } from "querystring";


class GetInstalled implements Feature_ {

    async execute(project: MyProject, params: FeatureParams<null>): Promise<Report<F_Dependency[]>> {
        return new Promise((resolve, _) => {
            resolve(Report.getReport({
                    isSuccess: true,
                    data: CratesService.getInstance().getInstalledDependencies()
                })
            )
        });
    }

    type(): FeatureType {
        return FeatureType.CRATES_GET_DEPENDENCIES;
    }

}

class InstallDependency implements Feature_{

    async execute(project: MyProject, params: FeatureParams<unknown>): Promise<Report<null>> {
        return new Promise((resolve, _) => {
            const args = params.params as F_Dependency;
            resolve(Report.getReport({
                    isSuccess: CratesService.getInstance().installDependency(args.id, args.version),
                    data: null
                })
            )
        });
    }

    type(): FeatureType {
        return FeatureType.CRATE_INSTALL_DEPENDENCY;
    }

}

/**
 * ASPECT Cargo
 */
export default class CratesIO implements Aspect_ {
    /**
     * List of all features of this Aspect
     */
    private static features_: Feature_[] = [
        new GetInstalled(), new InstallDependency()
    ]

    getType(): AspectType {
        return AspectType.CRATES;
    }

    getName(): string {
        return "CRATES";
    }

    getFeatureList(): Feature_[] {
        return CratesIO.features_;
    }

    async checkActive(project: MyProject): Promise<boolean> {
        const exists = await exists_script("cargo");
        if (exists === false)
            return false;
        let rootNode = project.getRootNode();
        let report = await run_script("cargo", ["verify-project"], rootNode.getPath());
        return report.code === 0;
    }
 
}


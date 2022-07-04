import { F_Dependency } from "../../../../src/shared/F_interfaces";
import { AspectType, FeatureType } from "../../../../src/shared/ideEnums";
import { Report } from "../../../../src/shared/report";
import { exists_script, run_script } from "../../../utils/runScripts";
import { Aspect_ } from "../aspect";
import { FeatureParams, Feature_ } from "../feature";
import { MyProject } from "../project";


class GetInstalled implements Feature_ {

    async execute(project: MyProject, params: FeatureParams<null>): Promise<Report<F_Dependency[]>> {
       
    }

    type(): FeatureType {
        return FeatureType.CRATES_GET_DEPENDENCIES;
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
        new GetInstalled()
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


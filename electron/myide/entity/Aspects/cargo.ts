import { exists_script, run_script } from "../../../utils/runScripts";
import { AspectType, Aspect_ } from "../aspect";
import { ExecutionReport, FeatureType, Feature_ } from "../feature";
import { Project_ } from "../project";


/**
 * ASPECT Cargo
 */
export default class Cargo implements Aspect_ {
    /**
     * List of all features of this Aspect
     */
    private static features_: Feature_[] = [
    ]

    getType(): AspectType {
        return AspectType.ANY;
    }

    getFeatureList(): Feature_[] {
        return Cargo.features_;
    }

    async checkActive(project: Project_): Promise<boolean> {
        const exists = await exists_script("cargo");
        if (exists === false)
            return false;
        let rootNode = project.getRootNode();
        let report = await run_script("cargo", ["verify-project"], rootNode.getPath());
        return report.code === 0;
    }
 
}


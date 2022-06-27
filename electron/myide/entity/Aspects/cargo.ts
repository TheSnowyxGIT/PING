import { Report } from "../../../utils/report";
import { exists_script, run_script } from "../../../utils/runScripts";
import { AspectType, Aspect_ } from "../aspect";
import { FeatureParams, FeatureType, Feature_ } from "../feature";
import { MyProject } from "../project";



class CargoBuild implements Feature_ {

    async execute(project: MyProject, params: FeatureParams): Promise<Report> {
        let rootNode = project.getRootNode();

        let report = await run_script("cargo", ["build"], rootNode.getPath(), {
            stderr: params.errCallback,
            stdout: params.outCallback
        });
        
        return Report.getReport({
            isSuccess: report.code === 0,
            err: report.stderr,
            out: report.stdout
        });
    }

    type(): FeatureType {
        return FeatureType.CARGO_BUILD;
    }
    
}

/**
 * ASPECT Cargo
 */
export default class Cargo implements Aspect_ {
    /**
     * List of all features of this Aspect
     */
    private static features_: Feature_[] = [
        new CargoBuild()
    ]

    getType(): AspectType {
        return AspectType.CARGO;
    }

    getFeatureList(): Feature_[] {
        return Cargo.features_;
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


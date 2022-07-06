import { AspectType, FeatureType } from "../../../../src/shared/ideEnums";
import { Report } from "../../../../src/shared/report";
import { exists_script, run_script } from "../../../utils/runScripts";
import { Aspect_ } from "../aspect";
import { FeatureParams, Feature_ } from "../feature";
import { MyProject } from "../project";



class CargoBuild implements Feature_ {

    async execute(project: MyProject, params: FeatureParams<null>): Promise<Report<null>> {
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

class CargoRun implements Feature_ {

    async execute(project: MyProject, params: FeatureParams<null>): Promise<Report<null>> {
        let rootNode = project.getRootNode();

        let report = await run_script("cargo", ["run"], rootNode.getPath(), {
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
        return FeatureType.CARGO_RUN;
    }
    
}

class CargoClean implements Feature_ {

    async execute(project: MyProject, params: FeatureParams<null>): Promise<Report<null>> {
        let rootNode = project.getRootNode();

        let report = await run_script("cargo", ["clean"], rootNode.getPath(), {
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
        return FeatureType.CARGO_CLEAN;
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
        new CargoBuild(),
        new CargoRun(),
        new CargoClean()
    ]

    getType(): AspectType {
        return AspectType.CARGO;
    }

    getName(): string {
        return "Cargo";
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


import { F_Aspect } from "../../../../src/shared/F_interfaces";
import { AspectType, FeatureType } from "../../../../src/shared/ideEnums";
import { Report } from "../../../../src/shared/report";
import { Aspect_, F_AspectFrom } from "../aspect";
import {FeatureParams, Feature_ } from "../feature";
import { MyProject } from "../project";

class ReloadAspects implements Feature_ {

    async execute(project: MyProject, params: FeatureParams): Promise<Report<F_Aspect[]>> {
        await project.loadAspect();
        return Report.getReport({
            isSuccess: true,
            message: "Aspects of projects have been loaded.",
            data: Array.from(project.getAspects()).map(aspect => F_AspectFrom(aspect))
        });
    }

    type(): FeatureType {
        return FeatureType.ANY_RELOAD_ASPECTS;
    }
}


/**
 * ASPECT ANY
 */
export default class Any implements Aspect_ {
    /**
     * List of all features of this Aspect
     */
    private static features_: Feature_[] = [
        new ReloadAspects()
    ]

    getType(): AspectType {
        return AspectType.ANY;
    }

    getName(): string {
        return "Any"
    }

    getFeatureList(): Feature_[] {
        return Any.features_;
    }

    public async checkActive(project: MyProject): Promise<boolean> {
        return true; // Always actived
    }
 
}


import { Report } from "../../../utils/report";
import { AspectType, Aspect_ } from "../aspect";
import {FeatureParams, FeatureType, Feature_ } from "../feature";
import { MyProject } from "../project";

class ReloadAspects implements Feature_ {

    async execute(project: MyProject, params: FeatureParams): Promise<Report> {
        await project.loadAspect();
        return Report.getReport({
            isSuccess: true,
            message: "Aspects of projects have been loaded.",
            data: {
                aspects: Array.from(project.getAspects()).map(aspect => aspect.getType())
            }
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

    getFeatureList(): Feature_[] {
        return Any.features_;
    }

    public async checkActive(project: MyProject): Promise<boolean> {
        return true; // Always actived
    }
 
}


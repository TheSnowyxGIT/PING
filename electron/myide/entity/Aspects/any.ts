import { AspectType, Aspect_ } from "../aspect";
import { ExecutionReport, FeatureType, Feature_ } from "../feature";
import { Project_ } from "../project";

class CleanUp implements Feature_ {

    execute(project: Project_, ...params: any[]): ExecutionReport {
        return null;
    }

    type(): FeatureType {
        return FeatureType.CLEANUP;
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
        new CleanUp()
    ]

    getType(): AspectType {
        return AspectType.ANY;
    }

    getFeatureList(): Feature_[] {
        return Any.features_;
    }

    checkActive(project: Project_): boolean {
        return true; // Always actived
    }
 
}


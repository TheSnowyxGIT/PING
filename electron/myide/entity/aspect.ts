import { F_Aspect } from "../../../src/shared/F_interfaces";
import { AspectType } from "../../../src/shared/ideEnums";
import Any from "./Aspects/any";
import Cargo from "./Aspects/cargo";
import { CratesDependencies } from "./Aspects/CratesDependencies";
import { Feature_ } from "./feature";
import { MyProject } from "./project";


export let AllAspects: Aspect_[] = [
    new Any(),
    new Cargo(),
    new CratesDependencies(),
];


export function F_AspectFrom(aspect: Aspect_): F_Aspect{
    return {
        type: aspect.getType(),
        name: aspect.getName()
    }
}


export interface Aspect_{
    /**
     * @return The type of the Aspect.
     */
    getType(): AspectType;

    /**
     * @return The type of the Aspect.
     */
     getName(): string;

    /**
     * @return The list of features associated with the Aspect.
     */
    getFeatureList(): Feature_[];

    /**
     * @return true if the aspect is active in the project, false otherwize
     */
    checkActive(project: MyProject): Promise<boolean>;
}

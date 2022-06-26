import Any from "./Aspects/any";
import Cargo from "./Aspects/cargo";
import { Feature_ } from "./feature";
import { Project_ } from "./project";

export enum AspectType {
    ANY
};

export let AllAspects: Aspect_[] = [
    new Any(),
    new Cargo()
];

export interface Aspect_ {
    /**
     * @return The type of the Aspect.
     */
    getType(): AspectType;

    /**
     * @return The list of features associated with the Aspect.
     */
    getFeatureList(): Feature_[];

    /**
     * @return true if the aspect is active in the project, false otherwize
     */
    checkActive(project: Project_): Promise<boolean>;
}

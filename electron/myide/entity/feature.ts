import { FeatureType } from "../../../src/shared/ideEnums";
import { Report } from "../../../src/shared/report";
import { MyProject} from "./project";

export interface FeatureParams {
    errCallback: (chunk: string) => void,
    outCallback: (chunk: string) => void,
    others?: any
};

export interface Feature_ {
    /**
     * @param project {@link Project_} on which the feature is executed.
     * @param params  Parameters given to the features.
     * @return {@link ExecutionReport}
     */
    execute(project: MyProject, params: FeatureParams): Promise<Report<unknown>>;

    /**
     * @return The type of the Feature.
     */
    type(): FeatureType;
}

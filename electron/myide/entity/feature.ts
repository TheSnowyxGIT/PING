import { FeatureType } from "../../../src/shared/ideEnums";
import { Report } from "../../../src/shared/report";
import { MyProject } from "./project";

export interface FeatureParams<ParamsType> {
    errCallback: (chunk: string) => void,
    outCallback: (chunk: string) => void,
    params: ParamsType
};

export interface Feature_ {
    /**
     * @param project {@link Project_} on which the feature is executed.
     * @param params  Parameters given to the features.
     * @return {@link ExecutionReport}
     */
    execute<ParamsType>(project: MyProject, params: FeatureParams<ParamsType>): Promise<Report<unknown>>;

    /**
     * @return The type of the Feature.
     */
    type(): FeatureType;
}

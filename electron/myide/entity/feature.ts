import { Report } from "../../utils/report";
import { MyProject} from "./project";

export enum FeatureType {
    ANY_RELOAD_ASPECTS,
    CARGO_BUILD
};


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
    execute(project: MyProject, params: FeatureParams): Promise<Report>;

    /**
     * @return The type of the Feature.
     */
    type(): FeatureType;
}

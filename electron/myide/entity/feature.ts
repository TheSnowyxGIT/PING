import { Project_ } from "./project";

export enum FeatureType {
    CLEANUP
};

export interface ExecutionReport {
    isSuccess(): boolean;
}

export interface Feature_ {
    /**
     * @param project {@link Project_} on which the feature is executed.
     * @param params  Parameters given to the features.
     * @return {@link ExecutionReport}
     */
    execute(project: Project_, ...params: any[]): ExecutionReport | null;

    /**
     * @return The type of the Feature.
     */
    type(): FeatureType;
}

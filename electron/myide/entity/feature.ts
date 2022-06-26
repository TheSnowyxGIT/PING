import { Project_ } from "./project";

export enum FeatureType {
    CLEANUP
};

export interface ExecutionReport {
    isSuccess: boolean
    message?: string
    stdout?: string;
    stderr?: string;
}

export interface Feature_ {
    /**
     * @param project {@link Project_} on which the feature is executed.
     * @param params  Parameters given to the features.
     * @return {@link ExecutionReport}
     */
    execute(project: Project_, ...params: any[]): ExecutionReport;

    /**
     * @return The type of the Feature.
     */
    type(): FeatureType;
}

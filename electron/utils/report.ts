export enum ReportState {
    ERROR,
    SUCCESS
}

export enum ErrorType {
    TEST
}

export interface ReportError {
    type: ErrorType,
    err: any
}

export interface Report {
    state: ReportState,
    error?: ReportError,
    data?: any 
}

export class ReportClass implements Report {
    public state: ReportState
    public error?: ReportError
    public data?: any

    public static Error(errorType: ErrorType, error: any) : ReportClass {
        return new ReportClass(ReportState.ERROR, {
            err: error,
            type: errorType
        });
    }

    public static Success(data: any) : ReportClass {
        return new ReportClass(ReportState.ERROR, undefined, data);
    }

    constructor(state: ReportState, error?: ReportError, data?: any) {
        this.state = state;
        this.error = error;
        this.data = data;
    }
}

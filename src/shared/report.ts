

export interface Report_<DataType> {
    isSuccess: boolean
    message?: string
    out?: string;
    err?: string;
    data?: DataType;
}


export class Report<DataType> implements Report_<DataType> {
    public isSuccess: boolean;
    public message?: string;
    public out?: string;
    public err?: string;
    public data?: DataType;

    public static getReport<T>(data: Report_<T>): Report<T> {
        let report = new Report<T>( data.isSuccess, data.data);
        report.message = data.message;
        report.err = data.err;
        report.out = data.out;
        return report;
    }

    constructor(success: boolean, data?: DataType){
        this.isSuccess = success;
        this.data = data;
    }
}

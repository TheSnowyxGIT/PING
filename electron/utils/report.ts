

export interface Report_ {
    isSuccess: boolean
    message?: string
    out?: string;
    err?: string;
    data?: any;
}


export class Report implements Report_ {
    public isSuccess: boolean;
    public message?: string;
    public out?: string;
    public err?: string;
    public data?: any;

    public static getReport(data: Report_): Report {
        let report = new Report();
        report.data = data.data;
        report.isSuccess = data.isSuccess;
        report.message = data.message;
        report.err = data.err;
        report.out = data.out;
        return report;
    }
}

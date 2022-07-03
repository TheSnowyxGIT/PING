import { ipcRenderer } from "electron";
import { RequestOptions } from "../listeners/listener";
import { Report } from "../../src/shared/report";

export interface ApiComponent<EntriesType, ReportType> {
    syncSend(data: EntriesType) : Promise<Report<ReportType>>;
    asyncSend(data: EntriesType) : void;
    on(listener: (report: Report<ReportType>) => void): void;
}

export interface ApiComponentOneWay<ReportType> {
    on(listener: (report: Report<ReportType>) => void): void;
}

/**
 * Envoie de la data au backend et renvoie la reponse
 */
export function SyncSend<OptionsType, ReportType>(channel: string, options: OptionsType): Promise<Report<ReportType>> {
    return new Promise((resolve, _) => {
        const execId = Math.floor(Math.random() * 1000000000);
        // Channel of the response
        let reportChannel = channel + ":report" + execId;

        function reportHandler(_: Electron.IpcRendererEvent, report: Report<ReportType>){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }

        const optionFormated: RequestOptions<OptionsType> = {
            reportChannel: reportChannel,
            params: options
        }

        ipcRenderer.send(channel, optionFormated);
        ipcRenderer.on(reportChannel, reportHandler)
    });
}

/**
 * Envoie de la data au backend
 */
export function AsyncSend<OptionsType>(channel: string, options: OptionsType): void {
    const optionFormated: RequestOptions<OptionsType> = {
        params: options
    }
    ipcRenderer.send(channel, optionFormated);
}

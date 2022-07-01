import {ipcRenderer} from "electron"
import { ExecFeatureOptions } from "../listeners/FeaturesListener";
import { FeatureType } from "../../src/shared/ideEnums";
import { Report } from "../../src/shared/report";

interface FeatureFrontParams<ParamsType> {
    out?: (chunk: string) => void,
    err?: (chunk: string) => void,
    params: ParamsType
}
export function execFeature<ParamsType, ReportType>(feature: FeatureType, params: FeatureFrontParams<ParamsType>) : Promise<Report<ReportType>> {
    return new Promise(async (resolve, reject) => {
        let channel = `execFeature`;
        let execId = Math.floor(Math.random() * 1000000000);

        // Set Optional params
        params.err = params.err ? params.err : (chunk: string) => {};
        params.out = params.out ? params.out : (chunk: string) => {};

        // Channel of the response
        let reportChannel = channel + ":report" + execId;
        // Channels of streams
        const errChannel = channel + ":err" + execId;
        const outChannel = channel + ":out" + execId;

        let featureOptions: ExecFeatureOptions<ParamsType> = {
            feature: feature,
            reportChannel: reportChannel,
            errChannel: errChannel,
            outChannel: outChannel,
            params: params.params
        }

        // Stream handlers for out stream and err stream
        const errHandler = (_: Electron.IpcRendererEvent, chunk: string) => {
            params.err(chunk);
        }
        ipcRenderer.on(errChannel, errHandler);
        const outHandler = (_: Electron.IpcRendererEvent, chunk: string) => {
            params.out(chunk);
        }
        ipcRenderer.on(outChannel, outHandler);

        function reportHandler(event: Electron.IpcRendererEvent, report: Report<ReportType>){
            ipcRenderer.removeListener(outChannel, outHandler);
            ipcRenderer.removeListener(errChannel, errHandler);

            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }

        ipcRenderer.send(channel, featureOptions);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

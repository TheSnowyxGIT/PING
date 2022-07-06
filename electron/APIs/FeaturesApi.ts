import {ipcRenderer} from "electron"
import { ExecFeatureParams } from "../listeners/FeaturesListener";
import { FeatureType } from "../../src/shared/ideEnums";
import { Report } from "../../src/shared/report";
import { RequestOptions } from "../listeners/listener";
import { FeatureFrontParams } from "../../src/shared/F_interfaces";

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

        let featureOptions: ExecFeatureParams<ParamsType> = {
            feature: feature,
            errChannel: errChannel,
            outChannel: outChannel,
            params: params.params
        }

        let requestOptions: RequestOptions<ExecFeatureParams<ParamsType>> = {
            reportChannel: reportChannel,
            params: featureOptions
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

        ipcRenderer.send(channel, requestOptions);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

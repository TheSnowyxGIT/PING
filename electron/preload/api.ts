import {ipcRenderer} from "electron"
import { ExecFeatureOptions, OpenProjectOptions } from "../listener";
import { AspectType } from "../myide/entity/aspect";
import { FeatureType } from "../myide/entity/feature";
import { Report } from "../utils/report";

/** Transfere Enums */

export const featureType = FeatureType;
export const aspectType = AspectType;



interface FeatureFrontParams {
    out?: (chunk: string) => void,
    err?: (chunk: string) => void
}
export function execFeature(feature: FeatureType, params: FeatureFrontParams) : Promise<Report> {
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

        let featureOptions: ExecFeatureOptions = {
            feature: feature,
            reportChannel: reportChannel,
            errChannel: errChannel,
            outChannel: outChannel
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

        function reportHandler(event: Electron.IpcRendererEvent, report: Report){
            ipcRenderer.removeListener(outChannel, outHandler);
            ipcRenderer.removeListener(errChannel, errHandler);

            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }

        ipcRenderer.send(channel, featureOptions);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}


export async function openProject(path: string): Promise<Report> {
    return new Promise((resolve, reject) => {
        let channel = `openProject`;
        let execId = Math.floor(Math.random() * 1000000000);
    
         // Channel of the response
         let reportChannel = channel + ":report" + execId;
    
         let options: OpenProjectOptions = {
            path: path,
            reportChannel: reportChannel,
        }
    
        function reportHandler(event: Electron.IpcRendererEvent, report: Report){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
    
        ipcRenderer.send(channel, options);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

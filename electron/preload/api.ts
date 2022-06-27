import {ipcRenderer} from "electron"
import { F_Node, F_Project } from "../../src/shared/F_interfaces";
import { FeatureType } from "../../src/shared/ideEnums";
import { CreateFileOptions, ExecFeatureOptions, OpenProjectOptions } from "../listener";
import { Report } from "../../src/shared/report";

/** Transfere Enums */

interface FeatureFrontParams {
    out?: (chunk: string) => void,
    err?: (chunk: string) => void
}
export function execFeature<T>(feature: FeatureType, params: FeatureFrontParams) : Promise<Report<T>> {
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

        function reportHandler(event: Electron.IpcRendererEvent, report: Report<T>){
            ipcRenderer.removeListener(outChannel, outHandler);
            ipcRenderer.removeListener(errChannel, errHandler);

            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }

        ipcRenderer.send(channel, featureOptions);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}



export async function openProject(): Promise<Report<F_Project>> {
    return new Promise((resolve, reject) => {
        let channel = `openProject`;
        let execId = Math.floor(Math.random() * 1000000000);
    
         // Channel of the response
         let reportChannel = channel + ":report" + execId;
    
         let options: OpenProjectOptions = {
            reportChannel: reportChannel,
        }
    
        function reportHandler(event: Electron.IpcRendererEvent, report: Report<F_Project>){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
    
        ipcRenderer.send(channel, options);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

export function onProjectOpened(listener: (report: Report<F_Project>) => void){
    ipcRenderer.on("openProject", (_, report: Report<F_Project>) => {
        listener(report);
    })
}



export function createFile(folderPath: string, name: string): Promise<Report<F_Node>> {
    return new Promise((resolve, reject) => {
        let channel = `createFile`;
        let execId = Math.floor(Math.random() * 1000000000);
    
         // Channel of the response
         let reportChannel = channel + ":report" + execId;
    
         let options: CreateFileOptions = {
             reportChannel: reportChannel,
             folderPath: folderPath,
             name: name
         }
    
        function reportHandler(event: Electron.IpcRendererEvent, report: Report<F_Node>){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
    
        ipcRenderer.send(channel, options);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

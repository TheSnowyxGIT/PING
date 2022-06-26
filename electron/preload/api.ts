import {ipcRenderer} from "electron"
import { ExecutionReport, FeatureType } from "../myide/entity/feature";


export interface StreamFeatureArgs {
    featureName: string,
    stdoutChannel: string,
    stderrChannel: string,
    reportChannel: string,
    args: any[]
}
export function execStreamFeature(featureName: string, args: any[], stdout: (chunk: string) => void, stderr: (chunk: string) => void) : Promise<ExecutionReport> {
    return new Promise(async (resolve, reject) => {
        let channel = `execStreamFeature`;
        let execId = Math.floor(Math.random() * 1000000000);
        let stdoutChannel = channel + ":stdout" + execId;
        let stderrChannel = channel + ":stderr" + execId;
        let reportChannel = channel + ":report" + execId;
        let streamFeatureArgs: StreamFeatureArgs = {
            featureName: featureName,
            stdoutChannel: stdoutChannel,
            stderrChannel: stderrChannel,
            reportChannel: reportChannel,
            args: args
        }
        function stdoutHandler(event: Electron.IpcRendererEvent, chunk: string){
            stdout(chunk);
        }
        function stderrHandler(event: Electron.IpcRendererEvent, chunk: string){
            stderr(chunk);
        }
        function reportHandler(event: Electron.IpcRendererEvent, report: ExecutionReport){
            ipcRenderer.removeListener(stdoutChannel, stdoutHandler);
            ipcRenderer.removeListener(stderrChannel, stderrHandler);
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
        ipcRenderer.on(stdoutChannel, stdoutHandler)
        ipcRenderer.on(stderrChannel, stderrHandler);

        ipcRenderer.send(channel, streamFeatureArgs);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

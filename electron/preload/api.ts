import {ipcRenderer} from "electron"
import { Report } from "./report";



export interface FileUpdate {
    path: string;
    data: Uint8Array;
};
export function saveFile(data: FileUpdate): Report {
    return ipcRenderer.sendSync("saveFile", data) as Report;
}

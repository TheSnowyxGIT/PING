import {ipcRenderer} from "electron"
import { F_Node, F_Project } from "../../src/shared/F_interfaces";
import { CreateFileOptions, CreateFolderOptions, GetContentOptions, OpenProjectOptions, SaveFileOptions } from "../listeners/ProjectListener";
import { Report } from "../../src/shared/report";

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


export function createFile(folderPath: string, name: string): void {
    let channel = `createFile`;

    let options: CreateFileOptions = {
         folderPath: folderPath,
         name: name
     }
    ipcRenderer.send(channel, options);
}

export function onFileCreated(listener: (report: Report<F_Node>) => void){
    ipcRenderer.on("createFile", (_, report: Report<F_Node>) => {
        listener(report);
    })
}


export function createFolder(folderPath: string, name: string): void {
    let channel = `createFolder`;

    let options: CreateFolderOptions = {
         folderPath: folderPath,
         name: name
     }
    ipcRenderer.send(channel, options);
}

export function onFolderCreated(listener: (report: Report<F_Node>) => void){
    ipcRenderer.on("createFolder", (_, report: Report<F_Node>) => {
        listener(report);
    })
}

export async function getContentFile(filePath: string): Promise<Report<string>> {
    return new Promise((resolve, reject) => {
        let channel = `getContentFile`;
        let execId = Math.floor(Math.random() * 1000000000);
    
         // Channel of the response
         let reportChannel = channel + ":report" + execId;
    
         let options: GetContentOptions = {
            reportChannel: reportChannel,
            filePath: filePath
        }
    
        function reportHandler(event: Electron.IpcRendererEvent, report: Report<string>){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
    
        ipcRenderer.send(channel, options);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

export function onMenuCargoBuild(listener: () => void){
    ipcRenderer.on("menu:cargo:build", (_, data) => {
        listener();
    })
}

export function savefile(filePath: string, content: string): Promise<Report<void>>{
    return new Promise((resolve, reject) => {
        let channel = `saveFile`;
        let execId = Math.floor(Math.random() * 1000000000);
    
         // Channel of the response
         let reportChannel = channel + ":report" + execId;
    
         let options: SaveFileOptions = {
            reportChannel: reportChannel,
            filePath: filePath,
            content: content
        }
    
        function reportHandler(event: Electron.IpcRendererEvent, report: Report<void>){
            ipcRenderer.removeListener(reportChannel, reportHandler);
            resolve(report);
        }
    
        ipcRenderer.send(channel, options);
        ipcRenderer.on(reportChannel, reportHandler)
    })
}

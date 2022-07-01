/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */
import * as controller from "../controllers/ProjectController";
import { ipcMain, } from "electron";

export interface OpenProjectOptions {
    reportChannel: string,
}
ipcMain.on("openProject", async (e, options) => {
    let OPoptions = options as OpenProjectOptions;

    let report = await controller.openProject();

    e.sender.send(OPoptions.reportChannel, report);
})


export interface CreateFileOptions {
    folderPath: string,
    name: string,
}
ipcMain.on("createFile", async (e, options) => {
    let CFoptions = options as CreateFileOptions;

    let report = await controller.createFile(CFoptions.folderPath, CFoptions.name);

    e.sender.send("createFile", report);
})


export interface CreateFolderOptions {
    folderPath: string,
    name: string,
}
ipcMain.on("createFolder", async (e, options) => {
    let CFoptions = options as CreateFolderOptions;

    let report = await controller.createFolder(CFoptions.folderPath, CFoptions.name);

    e.sender.send("createFolder", report);
})

export interface GetContentOptions {
    reportChannel: string,
    filePath: string
}
ipcMain.on("getContentFile", async (e, options) => {
    let GCoptions = options as GetContentOptions;

    let report = await controller.readFile(GCoptions.filePath);

    e.sender.send(GCoptions.reportChannel, report);
})

export interface SaveFileOptions {
    reportChannel: string,
    filePath: string,
    content: string
}
ipcMain.on("saveFile", async (e, options) => {
    let SFoptions = options as SaveFileOptions;

    let report = await controller.saveFile(SFoptions.filePath, SFoptions.content);

    e.sender.send(SFoptions.reportChannel, report);
})

/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */

import { createFile, createFolder, openProject, readFile, saveFile } from "./controller";
import { ipcMain, dialog } from "electron";
import { FeatureType } from "../src/shared/ideEnums";
import myide from "./myide/myide";
import { Report } from "../src/shared/report";


export interface ExecFeatureOptions {
    feature: FeatureType,
    outChannel: string,
    errChannel: string,
    reportChannel: string,
}
ipcMain.on("execFeature", async (e, options) => {
    let featureOptions = options as ExecFeatureOptions;

    let report = await myide.executeFeature(featureOptions.feature, {
        outCallback: (chunk: string) => e.sender.send(featureOptions.outChannel, chunk),
        errCallback: (chunk: string) => e.sender.send(featureOptions.errChannel, chunk),
    });

    e.sender.send(featureOptions.reportChannel, report)
})



export interface OpenProjectOptions {
    reportChannel: string,
}
ipcMain.on("openProject", async (e, options) => {
    let OPoptions = options as OpenProjectOptions;

    let report = await openProject();

    e.sender.send(OPoptions.reportChannel, report);
})


export interface CreateFileOptions {
    folderPath: string,
    name: string,
}
ipcMain.on("createFile", async (e, options) => {
    let CFoptions = options as CreateFileOptions;

    let report = await createFile(CFoptions.folderPath, CFoptions.name);

    e.sender.send("createFile", report);
})


export interface CreateFolderOptions {
    folderPath: string,
    name: string,
}
ipcMain.on("createFolder", async (e, options) => {
    let CFoptions = options as CreateFolderOptions;

    let report = await createFolder(CFoptions.folderPath, CFoptions.name);

    e.sender.send("createFolder", report);
})

export interface GetContentOptions {
    reportChannel: string,
    filePath: string
}
ipcMain.on("getContentFile", async (e, options) => {
    let GCoptions = options as GetContentOptions;

    let report = await readFile(GCoptions.filePath);

    e.sender.send(GCoptions.reportChannel, report);
})

export interface SaveFileOptions {
    reportChannel: string,
    filePath: string,
    content: string
}
ipcMain.on("saveFile", async (e, options) => {
    let SFoptions = options as SaveFileOptions;

    let report = await saveFile(SFoptions.filePath, SFoptions.content);

    e.sender.send(SFoptions.reportChannel, report);
})

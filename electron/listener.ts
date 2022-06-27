/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */

import { ipcMain } from "electron";
import myide from "./myide/myide";
import { FeatureType } from "./myide/entity/feature";



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
    path: string,
    reportChannel: string,
}
ipcMain.on("openProject", async (e, options) => {
    let OPoptions = options as OpenProjectOptions;

    let report = await myide.openProject(OPoptions.path);

    e.sender.send(OPoptions.reportChannel, report)
})

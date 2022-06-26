/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */

import { ipcMain } from "electron";
import { ExecutionReport } from "./myide/entity/feature";
import { StreamFeatureArgs } from "./preload/api";

ipcMain.on("execStreamFeature", (e, data) => {
    let streamFeatureArgs = data as StreamFeatureArgs;
    let report: ExecutionReport = {
        isSuccess: true
    }
    e.sender.send(streamFeatureArgs.reportChannel, report)
})

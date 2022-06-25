/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */

import { ipcMain } from "electron";
import { FileUpdate } from "./preload/api";
import { ErrorType, ReportClass } from "./preload/report";


ipcMain.on("saveFile", (e, data) => {
    let fileUpdate = data as FileUpdate;
    e.returnValue = ReportClass.Error(ErrorType.TEST, {message: "this is a hardcoded error !"});
})

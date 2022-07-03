import {app, BrowserWindow } from "electron";
import * as p from "path";

import "./listeners/FeaturesListener";
import "./listeners/ProjectListener"
import "./listeners/CratesListener"

import "./menu"
import "./myide/myide"


function createWindow(){
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: p.join(__dirname, "preload", "preload.js"),
        }
    });

    win.loadFile(p.join(__dirname, "../index.html"))

    //win.webContents.openDevTools();
}

app.on("ready", () => {
    createWindow()



    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    // If OS is not MacOS
    if (process.platform !== 'darwin') app.quit()
})

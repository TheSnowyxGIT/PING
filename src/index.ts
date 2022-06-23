import {app, BrowserWindow } from "electron";


function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile("index.html")
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    // If OS is not MacOS
    if (process.platform !== 'darwin') app.quit()
})

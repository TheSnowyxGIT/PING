import {ipcRenderer} from "electron"

export function sendMessage(msg: string): void {
    ipcRenderer.send("msg", msg);
}

export function onMessage(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
    ipcRenderer.on("msg", listener);
}

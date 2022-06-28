import { click } from "@testing-library/user-event/dist/click";
import { openProject } from "./controller";
import { BrowserWindow, ipcMain, Menu, MenuItem, MenuItemConstructorOptions } from "electron";



const template: (MenuItem | MenuItemConstructorOptions)[]= [
    {
        label: "MyIde",
        submenu: [
            {
                label: "Open Project",
                click: async function(){
                    let report = await openProject();
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send("openProject", report);
                }
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            { role: "undo" },
            { role: "redo" },
            { type: "separator" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
        ]
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

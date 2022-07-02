import { openProject } from "./controllers/ProjectController";
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
            }, 
            {
                label: "OpenDevTool",
                click: async function(){
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.openDevTools()
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
    },
    {
        label: "Cargo",
        submenu: [
            {
                label: "Build",
                click: async function(){
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send("menu:cargo:build");
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

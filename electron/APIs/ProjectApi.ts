import {ipcRenderer} from "electron"
import { F_Node, F_Project } from "../../src/shared/F_interfaces";
import { CreateFileParams, CreateFolderParams, DeleteFileParams, DeleteFolderParams, GetContentParams, SaveFileParams } from "../listeners/ProjectListener";
import { Report } from "../../src/shared/report";
import { ApiComponent, ApiComponentOneWay, AsyncSend, SyncSend } from "./apiUtils";

// Open Project
export const openProject: ApiComponent<void, F_Project> = {

    syncSend: async function (): Promise<Report<F_Project>> {
        const report = await SyncSend<void, F_Project>("openProject", null);
        return report;
    },

    asyncSend: function (): void {
        AsyncSend<void>("openProject", null);
    },

    on: function (listener: (report: Report<F_Project>) => void): void {
        ipcRenderer.on("openProject", (_, report: Report<F_Project>) => {
            listener(report);
        })
    }
};

// Create File
export const createFile: ApiComponent<{folderPath: string, name: string}, F_Node> = {

    syncSend: async function (data): Promise<Report<F_Node>> {
        const report = await SyncSend<CreateFileParams, F_Node>("createFile", {
            folderPath: data.folderPath,
            name: data.name
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<CreateFileParams>("createFile", {
            folderPath: data.folderPath,
            name: data.name
        });
    },

    on: function (listener: (report: Report<F_Node>) => void): void {
        ipcRenderer.on("createFile", (_, report: Report<F_Node>) => {
            listener(report);
        })
    }
}

// Create Folder
export const createFolder: ApiComponent<{folderPath: string, name: string}, F_Node> = {

    syncSend: async function (data): Promise<Report<F_Node>> {
        const report = await SyncSend<CreateFolderParams, F_Node>("createFolder", {
            folderPath: data.folderPath,
            name: data.name
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<CreateFolderParams>("createFolder", {
            folderPath: data.folderPath,
            name: data.name
        });
    },

    on: function (listener: (report: Report<F_Node>) => void): void {
        ipcRenderer.on("createFolder", (_, report: Report<F_Node>) => {
            listener(report);
        })
    }
}

// Get content of file
export const getContentFile: ApiComponent<{filePath: string}, string> = {

    syncSend: async function (data): Promise<Report<string>> {
        const report = await SyncSend<GetContentParams, string>("getContentFile", {
            filePath: data.filePath
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<GetContentParams>("getContentFile", {
            filePath: data.filePath
        });
    },

    on: function (listener: (report: Report<string>) => void): void {
        ipcRenderer.on("getContentFile", (_, report: Report<string>) => {
            listener(report);
        })
    }
}

// Save File
export const savefile: ApiComponent<{filePath: string, content: string}, void> = {

    syncSend: async function (data): Promise<Report<void>> {
        const report = await SyncSend<SaveFileParams, void>("saveFile", {
            filePath: data.filePath,
            content: data.content
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<SaveFileParams>("saveFile", {
            filePath: data.filePath,
            content: data.content
        });
    },

    on: function (listener: (report: Report<void>) => void): void {
        ipcRenderer.on("saveFile", (_, report: Report<void>) => {
            listener(report);
        })
    }
}

// Delete File
export const deleteFile: ApiComponent<{filePath: string}, string> = {

    syncSend: async function (data): Promise<Report<string>> {
        const report = await SyncSend<DeleteFileParams, string>("deleteFile", {
            filePath: data.filePath
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<DeleteFileParams>("deleteFile", {
            filePath: data.filePath
        });
    },

    on: function (listener: (report: Report<string>) => void): void {
        ipcRenderer.on("deleteFile", (_, report: Report<string>) => {
            listener(report);
        })
    }
}

// Delete Folder
export const deleteFolder: ApiComponent<{folderpath: string}, string> = {

    syncSend: async function (data): Promise<Report<string>> {
        const report = await SyncSend<DeleteFolderParams, string>("deleteFolder", {
            folderPath: data.folderpath
        });
        return report;
    },

    asyncSend: function (data): void {
        AsyncSend<DeleteFolderParams>("deleteFolder", {
            folderPath: data.folderpath
        });
    },

    on: function (listener: (report: Report<string>) => void): void {
        ipcRenderer.on("deleteFolder", (_, report: Report<string>) => {
            listener(report);
        })
    }
}

// File changed
export const fileChange: ApiComponentOneWay<string> = {
    on: function (listener: (report: Report<string>) => void): void {
        ipcRenderer.on("fileChange", (_, report: Report<string>) => {
            listener(report);
        })
    }
}

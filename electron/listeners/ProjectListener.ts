/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */
import * as controller from "../controllers/ProjectController";
import { on } from "./listener";
import { F_Node, F_Project } from "../../src/shared/F_interfaces";

// Open Project
on<void, F_Project>("openProject", async () => {
    let report = await controller.openProject();
    return report;
})

// Create File
export interface CreateFileParams {
    folderPath: string,
    name: string,
}
on<CreateFileParams, F_Node>("createFile", async (param) => {
    let report = await controller.createFile(param.folderPath, param.name);
    return report;
})

// Create Folder
export interface CreateFolderParams {
    folderPath: string,
    name: string,
}
on<CreateFolderParams, F_Node>("createFolder", async (param) => {
    let report = await controller.createFolder(param.folderPath, param.name);
    return report;
})

// Get Content of file
export interface GetContentParams {
    filePath: string
}
on<GetContentParams, string>("getContentFile", async (param) => {
    let report = await controller.readFile(param.filePath);
    return report;
})

// Save File
export interface SaveFileParams {
    filePath: string,
    content: string
}
on<SaveFileParams, void>("saveFile", async (param) => {
    let report = await controller.saveFile(param.filePath, param.content);
    return report;
})

// Delete File
export interface DeleteFileParams {
    filePath: string
}
on<DeleteFileParams, string>("deleteFile", async (param) => {
    let report = await controller.deleteFile(param.filePath)
    return report;
})

// Delete File
export interface DeleteFolderParams {
    folderPath: string
}
on<DeleteFolderParams, string>("deleteFolder", async (param) => {
    let report = await controller.deleteFolder(param.folderPath)
    return report;
})

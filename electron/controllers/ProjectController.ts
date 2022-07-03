import { dialog } from "electron";
import { Report } from "../../src/shared/report";
import { F_Node, F_Project } from "../../src/shared/F_interfaces";
import myide from "../myide/myide";
import { NodeType } from "../../src/shared/ideEnums";
import { F_NodeFrom } from "../myide/entity/node";
import * as p from "path"



export async function openProject(): Promise<Report<F_Project>> {
    // Open Dialog on the window
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    let report: Report<F_Project>;
    if (canceled){
        report = Report.getReport({
            isSuccess: false,
            message: "Open new project Canceled"
        });
    } else if (filePaths.length !== 1){
        report = Report.getReport({
            isSuccess: false,
            message: "Only one directory need to be open"
        });
    } else {
        report = await myide.openProject(filePaths[0]);
    }
    return report;
}


export async function createFile(folderPath: string, name: string): Promise<Report<F_Node>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }

    let nodeService = project.getNodeService();

    let folderNode = project.getRootNode().findChildRec(folderPath);
    if (folderNode === null){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderPath} is invalid.`
        })
    } else if (!folderNode.isFolder()){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderPath} need to be a folder.`
        });
    }
    try {
        let newNode = await nodeService.create(folderNode, name, NodeType.FILE);
        return Report.getReport<F_Node>({
            isSuccess: true,
            data: F_NodeFrom(newNode)
        });
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
}

export async function createFolder(folderPath: string, name: string): Promise<Report<F_Node>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }

    let nodeService = project.getNodeService();

    let folderNode = project.getRootNode().findChildRec(folderPath);
    if (folderNode === null){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderPath} is invalid.`
        })
    } else if (!folderNode.isFolder()){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderPath} need to be a folder.`
        });
    }
    try {
        let newNode = await nodeService.create(folderNode, name, NodeType.FOLDER);
        return Report.getReport<F_Node>({
            isSuccess: true,
            data: F_NodeFrom(newNode)
        });
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
}

export async function readFile(filePath: string): Promise<Report<string>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }

    let fileNode = project.getRootNode().findChildRec(filePath);
    if (fileNode === null){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${fileNode} is invalid.`
        })
    } else if (!fileNode.isFile()){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${fileNode} need to be a file.`
        });
    }

    try {
        let content = fileNode.getFileUTF8Content()
        return Report.getReport<string>({
            isSuccess: true,
            data: content
        });
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
}

export async function saveFile(filePath: string, content: string): Promise<Report<void>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }
    const ns = project.getNodeService();

    try {
        let fileNode = project.getRootNode().findChildRec(filePath);
        if (fileNode !== null){
            if (!fileNode.isFile()){
                return Report.getReport({
                    isSuccess: false,
                    message: `You can only overwrite a file`
                })
            }
            await ns.overwrite(fileNode, Buffer.from(content, 'utf-8'))
        } else {
            let folderPath = p.dirname(filePath);
            let fileName = p.basename(filePath);
            let folderNode = project.getRootNode().findChildRec(folderPath);
            if (folderNode === null){
                return Report.getReport({
                    isSuccess: false,
                    message: `The path ${filePath} is invalid`
                });
            }
            const newNode = await ns.create(folderNode, fileName, NodeType.FILE);
            await ns.overwrite(newNode, Buffer.from(content, 'utf-8'));
        }
        return Report.getReport({
            isSuccess: true
        })
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
   
}

export async function deleteFile(filepath: string): Promise<Report<string>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }

    let nodeService = project.getNodeService();

    let fileNode = project.getRootNode().findChildRec(filepath);
    if (fileNode === null){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${filepath} is invalid.`
        })
    } else if (!fileNode.isFile()){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${filepath} need to be a file.`
        });
    }
    try {
        await nodeService.delete(fileNode)
        return Report.getReport<string>({
            isSuccess: true,
            data: filepath
        });
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
}

export async function deleteFolder(folderpath: string): Promise<Report<string>> {
    let project = myide.getCurrentProject();

    if (project === null) {
        return Report.getReport({
            isSuccess: false,
            message: `There is no project opened.`
        })
    }

    let nodeService = project.getNodeService();

    let folderNode = project.getRootNode().findChildRec(folderpath);
    if (folderNode === null){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderNode} is invalid.`
        })
    } else if (!folderNode.isFolder()){
        return Report.getReport({
            isSuccess: false,
            message: `The path ${folderNode} need to be a folder.`
        });
    }
    try {
        await nodeService.delete(folderNode)
        return Report.getReport<string>({
            isSuccess: true,
            data: folderpath
        });
    } catch (error) {
        if (error instanceof Report){
            return error;
        }
        throw error;
    }
}

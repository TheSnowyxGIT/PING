import { dialog } from "electron";
import { Report } from "../src/shared/report";
import { F_Node, F_Project } from "../src/shared/F_interfaces";
import myide from "./myide/myide";
import { NodeType } from "../src/shared/ideEnums";
import { F_NodeFrom } from "./myide/entity/node";



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

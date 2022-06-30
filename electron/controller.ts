import { dialog } from "electron";
import { Report } from "../src/shared/report";
import { F_CratesDependency, F_Node, F_Project } from "../src/shared/F_interfaces";
import myide from "./myide/myide";
import { NodeType } from "../src/shared/ideEnums";
import { F_NodeFrom } from "./myide/entity/node";
import { Crate, CratesIO, Summary } from "crates.io"

const cratesIO = new CratesIO()

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


export async function getCratesDependenciesSummary(): Promise<Report<F_CratesDependency[]>> {
    function F_CratesDependencyFrom(data: Summary): F_CratesDependency[] {
        return data.most_downloaded.map((dep:Crate) => {return {
                    id: dep.id,
                    lastestVersion: dep.max_version
                }})
    }
    return new Promise((resolve, _) => {
        cratesIO.summary()
                .then((data: Summary) => {
                    resolve(Report.getReport({
                        isSuccess: true,
                        data: F_CratesDependencyFrom(data)
                    }));
                })
    });
}
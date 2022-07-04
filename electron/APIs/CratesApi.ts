import {ipcRenderer} from "electron"
import {  F_CratesDependencies, F_Dependency, F_Node, F_Project } from "../../src/shared/F_interfaces";
import { CreateFileParams, CreateFolderParams, GetContentParams, SaveFileParams } from "../listeners/ProjectListener";
import { Report } from "../../src/shared/report";
import { ApiComponent, AsyncSend, SyncSend } from "./apiUtils";
import { VoidFunctionComponent } from "react";

// get Crates summary
export const getSummary: ApiComponent<void, F_CratesDependencies> = {
    syncSend: async function (data): Promise<Report<F_CratesDependencies>> {
       const report = await SyncSend<void, F_CratesDependencies>("CratesGetSummary", null);
       return report;
    },
    asyncSend: function (data): void {
        AsyncSend<void>("CratesGetSummary", null);
    },
    on: function (listener: (report: Report<F_CratesDependencies>) => void): void {
       ipcRenderer.on("CratesGetSummary", (_, report) => listener(report));
    }
}

export interface DependenciesParams {
    name: string
    pageId: number
}
// get Crates dependencies by name
export const getDependencies: ApiComponent<{ name: string , pageId :number}, F_CratesDependencies> = {
    syncSend: async function (data): Promise<Report<F_CratesDependencies>> {
       const report = await SyncSend<DependenciesParams, F_CratesDependencies>("CratesGetDependencies", {
        name: data.name, 
        pageId: data.pageId
    });
       return report;
    },
    asyncSend: function (data): void {
        AsyncSend<DependenciesParams>("CratesGetDependencies", {
            name: data.name, 
            pageId: data.pageId
    });
    },
    on: function (listener: (report: Report<F_CratesDependencies>) => void): void {
       ipcRenderer.on("CratesGetDependencies", (_, report) => listener(report));
    }
}
import {ipcRenderer} from "electron"
import { F_CratesDependency, F_Node, F_Project } from "../../src/shared/F_interfaces";
import { CreateFileParams, CreateFolderParams, GetContentParams, SaveFileParams } from "../listeners/ProjectListener";
import { Report } from "../../src/shared/report";
import { ApiComponent, AsyncSend, SyncSend } from "./apiUtils";
import { VoidFunctionComponent } from "react";

// get Crates summary
export const getSummary: ApiComponent<void, F_CratesDependency[]> = {
    syncSend: async function (data): Promise<Report<F_CratesDependency[]>> {
       const report = await SyncSend<void, F_CratesDependency[]>("CratesGetSummary", null);
       return report;
    },
    asyncSend: function (data): void {
        AsyncSend<void>("CratesGetSummary", null);
    },
    on: function (listener: (report: Report<F_CratesDependency[]>) => void): void {
       ipcRenderer.on("CratesGetSummary", (_, report) => listener(report));
    }
}

export interface DependenciesParams {
    name: string
    pageId: number
}
// get Crates dependencies by name
export const getDependencies: ApiComponent<{ name: string , pageId :number}, F_CratesDependency[]> = {
    syncSend: async function (data): Promise<Report<F_CratesDependency[]>> {
       const report = await SyncSend<DependenciesParams, F_CratesDependency[]>("CratesGetDependencies", {
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
    on: function (listener: (report: Report<F_CratesDependency[]>) => void): void {
       ipcRenderer.on("CratesGetDependencies", (_, report) => listener(report));
    }
}

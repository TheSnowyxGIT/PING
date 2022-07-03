import internal from "stream";
import {F_CratesDependency } from "../shared/F_interfaces";

/**
 * represent the content of Rust dependency
 */

export class CratesDependency implements F_CratesDependency {
    public id: string;
    public lastestVersion: string;
    public currentPage: number;
    public isLastPage: boolean;

    constructor(id: string, lastestVersion: string,  currentPage: number, isLastPage: boolean) {
        this.id = id;
        this.lastestVersion = lastestVersion;
        this.currentPage = currentPage;
        this.isLastPage = isLastPage;
    }
    
    public static of(dependency: F_CratesDependency) {
        return new CratesDependency(dependency.id, dependency.lastestVersion,  dependency.currentPage, dependency.isLastPage);
    }
}
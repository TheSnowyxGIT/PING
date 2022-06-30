import internal from "stream";
import {F_CratesDependency } from "../shared/F_interfaces";

/**
 * represent the content of Rust dependency
 */

export class CratesDependency implements F_CratesDependency {
    public id: string;
    public lastestVersion: string;

    constructor(id: string, lastestVersion: string) {
        this.id = id;
        this.lastestVersion = lastestVersion;
    }
    
    public static of(dependency: F_CratesDependency) {
        return new CratesDependency(dependency.id, dependency.lastestVersion);
    }
}
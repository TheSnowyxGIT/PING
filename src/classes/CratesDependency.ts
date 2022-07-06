import internal from "stream";
import { F_CratesObj } from "../shared/F_interfaces";

/**
 * represent the content of Rust dependency
 */

export class CratesDependency implements F_CratesObj {
    public id: string;
    public lastestVersion: string;

    constructor(id: string, lastestVersion: string) {
        this.id = id;
        this.lastestVersion = lastestVersion;
    }
    
    public static of(dependency: F_CratesObj) {
        return new CratesDependency(dependency.id, dependency.lastestVersion);
    }
}
import { F_Dependency } from "../../../src/shared/F_interfaces";
import { readFileSync, promises as fsPromises, writeFileSync } from 'fs';
import { join } from 'path';
import MyIde from "../myide";

const TOML = require('@iarna/toml')

export class CratesService {
    // Singleton
    private static instance: CratesService | null = null;
    
    public static getInstance(): CratesService {
        if (!CratesService.instance)
            throw new Error("CratesService instance null");
        return CratesService.instance;
    }

    constructor() {
        if (CratesService.instance){
            return CratesService.instance;
        }
        CratesService.instance = this;
    }

    public getInstalledDependencies() : F_Dependency[] {
        const project = MyIde.getCurrentProject();
        if (project === null)
            return [];
        const configFile = readFileSync(join(project.getRootNode().getPath(), "Cargo.toml"), 'utf-8');
        console.log(configFile);
        const config = TOML.parse(configFile);
        const dependencies_ids = Object.keys(config.dependencies);
        return dependencies_ids.map(id => {
            return {
                id: id,
                version: config.dependencies[id]
            }
        })     
    }

    public installDependency(id: string, version: string): boolean {
        const project = MyIde.getCurrentProject();
        if (project === null)
            return false;
        const configFile = readFileSync(join(project.getRootNode().getPath(), "Cargo.toml"), 'utf-8');
        const config = TOML.parse(configFile);
        config.dependencies[id] = version;
        var res = TOML.stringify(config);
        writeFileSync(join(project.getRootNode().getPath(), "Cargo.toml"), res)
        console.log(res);
        return true;
    }
}
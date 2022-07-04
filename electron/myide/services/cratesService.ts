import { F_Dependency } from "../../../src/shared/F_interfaces";
const fs = require('fs');
const toml = require('toml');

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

    public getInstallDependencies() : F_Dependency[] {
        const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
        const dependencies_ids = Object.keys(config.dependencies);
        return dependencies_ids.map(id => {
            return {
                id: id,
                version: config.dependencies[id]
            }
        })
            
    }
}
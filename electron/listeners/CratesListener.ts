import { F_CratesDependencies} from "../../src/shared/F_interfaces";
import { on } from "./listener";
import * as controller from "../controllers/CratesController";
import { DependenciesParams } from "../APIs/CratesApi";



//Get summary
on<void, F_CratesDependencies>("CratesGetSummary", async () => {
    let report = await controller.getCratesDependenciesSummary();
    return report;
})

//get depnedencies by name
on<DependenciesParams, F_CratesDependencies>("CratesGetDependencies", async (param) => {
    let report = await controller.getCratesDependencies(param.name, param.pageId);
    return report;
})

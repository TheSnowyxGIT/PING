import { F_Project } from "../../src/shared/F_interfaces";
import { FeatureType } from "../../src/shared/ideEnums";
import { Report } from "../../src/shared/report";
import { FeatureParams } from "./entity/feature";
import { F_ProjectFrom, MyProject } from "./entity/project";
import ProjectService from "./services/projectService";


class MyIde {

    private projectService: ProjectService = new ProjectService();
    private curr_project: MyProject = null;

    public getCurrentProject(){
        return this.curr_project;
    }

    public executeFeature<ParamsType>(feature: FeatureType, params: FeatureParams<ParamsType>): Promise<Report<unknown>> {
        return this.projectService.execute(this.getCurrentProject(), feature, params);
    }

    /**
     * Open new project
     * @param path The Path of the new Project
     * @returns Report
     */
    public async openProject(path: string): Promise<Report<F_Project>> {
        try {
            let project = await this.projectService.load(path);
            this.curr_project = project;

            return Report.getReport({
                isSuccess: true,
                message: `Project ${project.getRootNode().getName()} succesfully loaded.`,
                data: F_ProjectFrom(project)
            });

        } catch (err) {
            if (err instanceof Report){
                return err;
            }
            throw err;
        }
    }



}

export default new MyIde();


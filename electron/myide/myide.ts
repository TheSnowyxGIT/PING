import { F_Project } from "../../src/shared/F_interfaces";
import { FeatureType } from "../../src/shared/ideEnums";
import { Report } from "../../src/shared/report";
import { FeatureParams } from "./entity/feature";
import { F_ProjectFrom, MyProject } from "./entity/project";
import ProjectService from "./services/projectService";
import { ProjectWatcher } from "./services/watchService";

class MyIde {

    private projectService: ProjectService = new ProjectService();
    private curr_project: MyProject = null;

    public getCurrentProject(){
        return this.curr_project;
    }

    public async executeFeature<ParamsType>(feature: FeatureType, params: FeatureParams<ParamsType>): Promise<Report<unknown>> {
        if (this.getCurrentProject() === null){
            return Report.getReport<unknown>({
                isSuccess: false,
                message: "There is no project opened."
            });
        }
        return await this.projectService.execute(this.getCurrentProject(), feature, params);
    }

    /**
     * Open new project
     * @param path The Path of the new Project
     * @returns Report
     */
    public async openProject(path: string): Promise<Report<F_Project>> {
        try {
            if (ProjectWatcher.current_watcher){
                ProjectWatcher.current_watcher.close()
            }
            let project = await this.projectService.load(path);
            this.curr_project = project;
            ProjectWatcher.current_watcher = new ProjectWatcher(this.curr_project)

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


import { Report } from "../utils/report";
import { FeatureParams, FeatureType } from "./entity/feature";
import { MyProject } from "./entity/project";
import ProjectService from "./services/projectService";


class MyIde {

    private projectService: ProjectService = new ProjectService();
    private curr_project: MyProject;

    constructor(){
        this.openProject("C:\\Users\\Adrien\\Desktop\\testcratesio\\testtttes")
    }

    public getCurrentProject(){
        return this.curr_project;
    }

    public executeFeature(feature: FeatureType, params: FeatureParams): Promise<Report> {
        return this.projectService.execute(this.getCurrentProject(), feature, params);
    }

    /**
     * Open new project
     * @param path The Path of the new Project
     * @returns Report
     */
    public async openProject(path: string): Promise<Report> {
        try {
            let project = await this.projectService.load(path);
            await project.loadAspect()
            this.curr_project = project;

            return Report.getReport({
                isSuccess: true,
                message: `Project ${project.getRootNode().getName()} succesfully loaded.`,
                data: {}
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


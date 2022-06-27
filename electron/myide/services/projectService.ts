import { Report } from "../../utils/report";
import { FeatureParams, FeatureType } from "../entity/feature";
import { MyNode } from "../entity/node";
import { MyProject } from "../entity/project";
import NodeService from "./nodeService";


export default class ProjectService {

    public async load(root: string): Promise<MyProject> {
        let rootNode = await MyNode.load(root, null);

        let project = new MyProject(rootNode);

        await project.loadAspect();

        return project;
    }

    public async execute(project: MyProject, featureType: FeatureType, params: FeatureParams) : Promise<Report> {
        let feature = project.getFeature(featureType);
        if (feature == null){
            return Report.getReport({
                isSuccess: false,
                message: "The project does not contains the Aspect of the requested feature"
            });
        }
        return await feature.execute(project, params);
    }


    public getNodeService(): NodeService {
        return new NodeService();
    }

}

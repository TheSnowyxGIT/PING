import { ExecutionReport, FeatureType } from "../entity/feature";
import { MyNode } from "../entity/node";
import { MyProject } from "../entity/project";
import NodeService from "./nodeService";


export default class ProjectService {

    public async load(root: string):Promise<MyProject> {
        let rootNode = await MyNode.load(root, null);

        let project = new MyProject(rootNode);

        await project.loadAspect();

        return project;
    }

    public async execute(project: MyProject, featureType: FeatureType, ...params: any[]) : Promise<ExecutionReport | null> {
        let feature = project.getFeature(featureType);
        if (feature == null){
            throw new Error("The project does not contains the feature used");
        }
        return await feature.execute(project, params);
    }


    public getNodeService(): NodeService {
        return new NodeService();
    }

}

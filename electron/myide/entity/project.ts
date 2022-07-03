import NodeService from "../../myide/services/nodeService";
import { F_Project } from "../../../src/shared/F_interfaces";
import { FeatureType } from "../../../src/shared/ideEnums";
import { Aspect_ , AllAspects, F_AspectFrom} from "./aspect";
import { Feature_ } from "./feature";
import { F_NodeFrom, MyNode } from "./node";
import * as p from "path"


export function F_ProjectFrom(project: MyProject): F_Project {
    return {
        aspects: Array.from(project.getAspects()).map(aspect => F_AspectFrom(aspect)),
        rootNode: F_NodeFrom(project.getRootNode())
    }
}


export class MyProject {

    private rootNode_: MyNode;
    private nodeService: NodeService;
    private aspects_: Set<Aspect_>;

    /**
     * Constructor
    */
    constructor(rNode: MyNode){
        this.rootNode_ = rNode;
        this.aspects_ = new Set();
        this.nodeService = new NodeService();
    }

    /**
     * @return The root node of the project.
    */
    public getRootNode(): MyNode {
        return this.rootNode_;
    }

    /**
     * @return The aspects of the project.
     */
    public getAspects(): Set<Aspect_> {
        return this.aspects_;
    }

    public getNodeService(): NodeService {
        return this.nodeService;
    }

    /**
     * Get an optional feature of the project depending
     * of its type. Returns an empty optional if the
     * project does not have the features queried.
     *
     * @param featureType Type of the feature to retrieve.
     * @return An optional feature of the project.
     */
    public getFeature(featureType: FeatureType): Feature_ | null {
        let all_features = this.getFeatures();
        let feature: Feature_ | null = null;
        for (let f of all_features){
            if (f.type() === featureType){
                feature = f;
                break;
            }
        }
        return feature;
    }

    /**
     * @return The list of the project features.
     */
    public getFeatures(): Feature_[] {
        let aspects = this.getAspects();
        let all_features: Feature_[] = [];
        for (let aspect of Array.from(aspects.values())){
            all_features = all_features.concat(aspect.getFeatureList());
        }
        return all_features;
    }

    public async loadAspect(): Promise<void> {
        this.aspects_ = new Set();
        for (let aspect of AllAspects){
            let actived = await aspect.checkActive(this);
            if (actived){
                this.aspects_.add(aspect);
            }
        }
    }

    /**
     * Check if the given path is inside the project
     */
    public isIn(path: string): boolean {
        const relative = p.relative(this.getRootNode().getPath(), path);
        return relative && !relative.startsWith('..') && !p.isAbsolute(relative);
    }
}

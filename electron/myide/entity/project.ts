import { Aspect_ , AllAspects} from "./aspect";
import { FeatureType, Feature_ } from "./feature";
import { MyNode } from "./node";

export class MyProject {

    private rootNode_: MyNode;
    private aspects_: Set<Aspect_>;

    /**
     * Constructor
    */
    constructor(rNode: MyNode){
        this.rootNode_ = rNode;
        this.aspects_ = new Set();
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
}

import { Aspect_ , AllAspects} from "./aspect";
import { FeatureType, Feature_ } from "./feature";
import { MyNode } from "./node";

export interface Project_ {
    /**
     * @return The root node of the project.
    */
    getRootNode(): MyNode;

    /**
     * @return The aspects of the project.
     */
    getAspects(): Set<Aspect_>;

    /**
     * Get an optional feature of the project depending
     * of its type. Returns an empty optional if the
     * project does not have the features queried.
     *
     * @param featureType Type of the feature to retrieve.
     * @return An optional feature of the project.
     */
    getFeature(featureType: FeatureType): Feature_ | null;

    /**
     * @return The list of the project features.
     */
    getFeatures(): Feature_[];
}


export class MyProject implements Project_ {

    private rootNode_: MyNode;
    private aspects_: Set<Aspect_>;

    /**
     * Constructor
    */
    constructor(rNode: MyNode){
        this.rootNode_ = rNode;
        this.aspects_ = new Set();
    }

    public getRootNode(): MyNode {
        return this.rootNode_;
    }

    public getAspects(): Set<Aspect_> {
        return this.aspects_;
    }

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

    public getFeatures(): Feature_[] {
        let aspects = this.getAspects();
        let all_features: Feature_[] = [];
        for (let aspect of Array.from(aspects.values())){
            all_features.concat(aspect.getFeatureList());
        }
        return all_features;
    }

    public loadAspect(): void {
        this.aspects_ = new Set();
        for (let aspect of AllAspects){
            if (aspect.checkActive(this)){
                this.aspects_.add(aspect);
            }
        }
    }
}

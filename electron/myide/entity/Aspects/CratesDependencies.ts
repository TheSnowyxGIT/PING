import { AspectType, FeatureType } from "../../../../src/shared/ideEnums";
import { Report } from "../../../../src/shared/report";
import { Aspect_ } from "../aspect";
import { FeatureParams, Feature_ } from "../feature";
import { MyProject } from "../project";
import { Crate, CratesIO, Summary } from "crates.io"

const cratesIO = new CratesIO()

export class CratesDependencies{
    
    /**
     * @return The type of the Aspect.
     */
      getType(): AspectType {
        return AspectType.CRATESDEP;
      }

      /**
       * @return The type of the Aspect.
       */
       getName(): string {
        return "CRATESDEP";
       }
  
      /**
       * @return The list of features associated with the Aspect.
       */
      getFeatureList(): Feature_[]
      {
        return []
      }
  
      /**
       * @return true if the aspect is active in the project, false otherwize
       */
      async checkActive(project: MyProject): Promise<boolean> {
        return true;
      }
}
import { FeatureParams } from "../myide/entity/feature";
import { FeatureType } from "../../src/shared/ideEnums";
import myide from "../myide/myide";
import { Report } from "../../src/shared/report";


export async function execFeature<ParamsType>(feature: FeatureType, params: FeatureParams<ParamsType>): Promise<Report<unknown>> {

    let report = await myide.executeFeature<unknown>(feature, {
        outCallback: (chunk: string) => params.outCallback(chunk),
        errCallback: (chunk: string) => params.errCallback(chunk),
        params: params.params
    });

    return report;
}

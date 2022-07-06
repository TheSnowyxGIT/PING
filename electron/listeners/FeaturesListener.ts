/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */
import { FeatureType } from "../../src/shared/ideEnums";
import { Report } from "../../src/shared/report";
import * as controller from "../controllers/FeaturesController"
import { on } from "./listener";

export interface ExecFeatureParams<ParamsType> {
    feature: FeatureType,
    outChannel: string,
    errChannel: string,
    params: ParamsType
}
on<ExecFeatureParams<unknown>, unknown>("execFeature", async (params, e) => {
    let report = await controller.execFeature<unknown>(params.feature, {
        outCallback: (chunk: string) => e.sender.send(params.outChannel, chunk),
        errCallback: (chunk: string) => e.sender.send(params.errChannel, chunk),
        params: params.params
    })
    
    return report;
})

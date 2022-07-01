/**
 * This file defined all entry points of the mainProcess for the request did by the renderer proccess
 */
import { ipcMain, } from "electron";
import { FeatureType } from "../../src/shared/ideEnums";
import * as controller from "../controllers/FeaturesController"

export interface ExecFeatureOptions<ParamsType> {
    feature: FeatureType,
    outChannel: string,
    errChannel: string,
    reportChannel: string,
    params: ParamsType
}
ipcMain.on("execFeature", async (e, options) => {
    let featureOptions = options as ExecFeatureOptions<unknown>;

    const report = await controller.execFeature<unknown>(featureOptions.feature, {
        outCallback: (chunk: string) => e.sender.send(featureOptions.outChannel, chunk),
        errCallback: (chunk: string) => e.sender.send(featureOptions.errChannel, chunk),
        params: featureOptions.params
    })

    e.sender.send(featureOptions.reportChannel, report)
})

import { ipcMain } from "electron"
import { Report } from "../../src/shared/report"

/** Import All Listeners */

export interface RequestOptions<RequestData> {
    reportChannel?: string
    params: RequestData
}

export async function on<ParamsType, ReportType>(channel: string, action: (params: ParamsType, event: Electron.IpcMainEvent) => Promise<Report<ReportType>>){
    ipcMain.on(channel, async (e, options: RequestOptions<ParamsType>) => {
        const report = await action(options.params, e);
        if (options.reportChannel) {
            // Sync
            e.sender.send(options.reportChannel, report);
        } else {
            // Async
            e.sender.send(channel, report);
        }
    })
}

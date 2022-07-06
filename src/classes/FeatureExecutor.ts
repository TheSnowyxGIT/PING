import React from "react";
import { AlertType } from "../components/Alerts/Alert";
import AlertQueue from "../components/Alerts/AlertQueue";
import { Terminal } from "../components/Terminal/Terminal";
import TerminalWindow from "../components/Terminal/TerminalWindow";
import { FeatureFrontParams } from "../shared/F_interfaces";
import { FeatureType } from "../shared/ideEnums";
import { Report } from "../shared/report";
import { Ide } from "./Ide";
import { Stream } from "./utils/stream";

export class FeatureExecutor {

    // Singleton
    private static instance: FeatureExecutor;
    public static getInstance(){
        return this.instance;
    }

    // attributes
    private isRunning_ = false;
    private terminalOpened_ = false;

    constructor(){
        if (FeatureExecutor.instance){
            return FeatureExecutor.instance;
        }
        FeatureExecutor.instance = this;
    }

    public isRunning(): boolean {
        return this.isRunning_;
    }

    public getTerminalOpened(): boolean {
        return this.terminalOpened_;
    }

    public setIsRunning(state: boolean, update: boolean = true){
        this.isRunning_ = state;
        update && Ide.getInstance().updateReact();
    }

    public openTerminal(update: boolean = true){
        this.terminalOpened_ = true;
        update && Ide.getInstance().updateReact();
    }

    public closeTerminal(update: boolean = true) {
        this.terminalOpened_ = false;
        update && Ide.getInstance().updateReact();
    }

    public async exec<ParamType, ReportType>(feature: FeatureType, params: ParamType, showStream = false): Promise<Report<ReportType>> {
        if (this.isRunning()){
            return Report.getReport({isSuccess: false, message: "There is already a feature in execution"})
        } else {
            this.setIsRunning(true, false);
            this.openTerminal(false)
            Ide.getInstance().updateReact();
            TerminalWindow.getInstance().terminal.current?.clear()
            const report = await window.features.execFeature<ParamType, ReportType>(feature, {
                err: (chunk) => {TerminalWindow.getInstance().terminal.current?.pushStderr(chunk)},
                out: (chunk) => {TerminalWindow.getInstance().terminal.current?.pushStdout(chunk)},
                params: params
            });
            this.setIsRunning(false, false);
            Ide.getInstance().updateReact();
            return report;
        }
    }
}

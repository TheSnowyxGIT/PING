import React from "react";
import { threadId } from "worker_threads";
import { CratesDependency } from "../classes/CratesDependency";
import { F_CratesDependency } from "../shared/F_interfaces";
import { Report } from "../shared/report";
import { AlertType } from "./Alert";
import AlertQueue from "./AlertQueue";
import CratesDependencyBox from "./CratesDependencyBox";

interface CratesIOWindowProps {

}
 
interface CratesIOWindowState {
    cratesDependencies: CratesDependency[]
}
 
class CratesIOWindow extends React.Component<CratesIOWindowProps, CratesIOWindowState> {
    constructor(props: CratesIOWindowProps) {
        super(props);
        this.state = {
            cratesDependencies: [
                new CratesDependency("api", "19.0.1")
            ] };
    }


    getDependencies(keyword: string): void {
        //window.electron.getCratesDependenciesSummary().then( report => {
        //    if (!report.isSuccess)
        //        AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Display dependencies", content: report.message || "unknown"});
        //    if (report.data !== null && report.data !== undefined) 
        //        this.setState({
        //            cratesDependencies: report.data.map(cratesDep => {
        //                return CratesDependency.of(cratesDep);
        //            })
        //        })
        //})
    }

    getSummary(): void {
            window.electron.getCratesDependenciesSummary().then( report => {
            if (!report.isSuccess)
                AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Display dependencies", content: report.message || "unknown"});
            if (report.data !== null && report.data !== undefined) 
                this.setState({
                    cratesDependencies: report.data.map(cratesDep => {
                        //console.log( CratesDependency.of(cratesDep));
                        return CratesDependency.of(cratesDep);
                    })
                })
        })
    }


    render() {
        this.getSummary();
        return (
            <div className="crates-io-window">
                <input className="input-dependency-name" type="text" onChange={(event) => this.getDependencies(event.target.value)}/>
                <div className="dependency-boxs">
                    {
                        this.state.cratesDependencies.map(dependency =>
                        {
                            return <CratesDependencyBox 
                                dependency={dependency}
                                onDownload={() => console.log(dependency.id + "  dl click")} />   
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default CratesIOWindow;
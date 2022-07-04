import React from "react";
import { threadId } from "worker_threads";
import { CratesDependency } from "../../classes/CratesDependency";
import { CratesManager } from "../../classes/CratesManager";
import { AlertType } from "../Alerts/Alert";
import AlertQueue from "../Alerts/AlertQueue";
import CratesDependencyBox from "./CratesDependencyBox";

interface CratesIOWindowProps {

}

interface CratesIOWindowState {
    cratesDependencies: CratesDependency[];
    firstTime: boolean;
    depName: string; //Input currently in the search bar
    pageId: number;
    lastPage: number;
    waitForResponse: boolean;
}

class CratesIOWindow extends React.Component<CratesIOWindowProps, CratesIOWindowState> {
    constructor(props: CratesIOWindowProps) {
        super(props);
        this.state = {
            cratesDependencies: [],
            firstTime: true,
            depName: "",
            pageId: 1,
            lastPage: 0,
            waitForResponse: true
        }
    }

    getDependencies(keyword: string, pageId: number): void {
        console.log(`Start search with ${keyword}`)
        this.setState({
            waitForResponse: true
        })
        window.crates.getDependencies.syncSend({
            name: keyword,
            pageId: pageId
        }).then(report => {
            this.setState({
                waitForResponse: false
            })
            if (!report.isSuccess)
                AlertQueue.sendAlert({ time: 3000, type: AlertType.ERROR, title: "Display dependencies", content: report.message || "unknown" });
            if (report.data !== null && report.data !== undefined)
                this.setState({
                    cratesDependencies: report.data.cratesList.map(cratesDep => {
                        return CratesDependency.of(cratesDep);
                    }),
                    lastPage: report.data.lastPage
                    
                })
        })
    }

    getSummary(): void {
        this.setState({
            waitForResponse: true
        })
        window.crates.getSummary.syncSend().then(report => {
            this.setState({
                waitForResponse: false
            })
            if (!report.isSuccess)
                AlertQueue.sendAlert({ time: 3000, type: AlertType.ERROR, title: "Display dependencies", content: report.message || "unknown" });
            if (report.data !== null && report.data !== undefined)
                this.setState({
                    cratesDependencies: report.data.cratesList.map(cratesDep => {
                        return CratesDependency.of(cratesDep);
                    }),
                    lastPage : report.data.lastPage
                })
        })
    }

    render() {

        if (this.state.firstTime) {
            this.getSummary();
            this.setState({
                firstTime: false
            })
        }
        return (
            <div className="crates-io-window">
                <input className="input-dependency-name" type="text" onChange={(event) => {
                    if (event.target.value === "")
                        this.getSummary()
                    else {
                        this.getDependencies(event.target.value, this.state.pageId)
                    }
                    this.setState({
                        depName: event.target.value,
                        pageId: 1
                    });
                }} />
                <button className="prev-page" disabled={this.state.waitForResponse} hidden={this.state.depName === "" || this.state.pageId === 1} onClick={() => {
                    this.setState({
                        pageId: this.state.pageId - 1
                    });
                    this.getDependencies(this.state.depName, this.state.pageId)
                }}>Prec.</button>
                <button className="next-page" disabled={this.state.waitForResponse} hidden={ this.state.depName === "" || this.state.lastPage < this.state.pageId} onClick={() => {
                    console.log(this.state.lastPage)
                    this.setState({
                        pageId: this.state.pageId + 1
                    });
                    this.getDependencies(this.state.depName, this.state.pageId)
                }}>Suiv.</button>
                <h1>pages: {this.state.pageId}/{this.state.lastPage + 1}</h1> 
                <div className="dependency-boxs">
                    {
                        this.state.cratesDependencies.map(dependency => {
                            return <CratesDependencyBox
                                dependency={dependency}
                                installed = {CratesManager.getInstance().getInstalledDependencies().some(iDep => iDep.id === dependency.id)}
                                onDownload={() => CratesManager.getInstance().addInstalledDependency({
                                    id: dependency.id,
                                    version: dependency.lastestVersion
                                })} />
                        })
                    }
                </div>
            </div>
        );
    }
}

export default CratesIOWindow;
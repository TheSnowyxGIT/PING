import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {faPlay} from "@fortawesome/free-solid-svg-icons"
import { FeatureType } from "../../shared/ideEnums";
import { FeatureExecutor } from "../../classes/FeatureExecutor";
import AlertQueue from "../Alerts/AlertQueue";

interface CargoWindowProps {
    
}
 
interface CargoWindowState {
    
}
 
class CargoWindow extends React.Component<CargoWindowProps, CargoWindowState> {
    constructor(props: CargoWindowProps) {
        super(props);
        this.state = {  };
    }
    render() { 
        return (
            <div className="cargoWindow">
                <div className="cmds">
                    <div className="feature">
                        <div className="name">Build</div>
                        <div className="btn" onClick={() => {
                            FeatureExecutor.getInstance().exec<null, null>(FeatureType.CARGO_BUILD, null, true).then(report => {
                                if (!report.isSuccess){
                                    AlertQueue.showReport("Exec Cargo Build", report);
                                }
                            })
                        }}>
                            <FontAwesomeIcon icon={faPlay}/>
                        </div>
                    </div>
                    <div className="feature">
                        <div className="name">Clean</div>
                        <div className="btn" onClick={() => {
                            FeatureExecutor.getInstance().exec<null, null>(FeatureType.CARGO_CLEAN, null, true).then(report => {
                                if (!report.isSuccess){
                                    AlertQueue.showReport("Exec Cargo Clean", report);
                                }
                            })
                        }}>
                            <FontAwesomeIcon icon={faPlay}/>
                        </div>
                    </div>
                </div>
                <div className="run">
                    <div className="header">
                        <span>Run</span>
                        <div className="btn" onClick={() => {
                            FeatureExecutor.getInstance().exec<null, null>(FeatureType.CARGO_RUN, null, true).then(report => {
                                if (!report.isSuccess){
                                    AlertQueue.showReport("Exec Cargo Run", report);
                                }
                            })
                        }}>
                            <FontAwesomeIcon icon={faPlay}/>
                        </div>
                    </div>
                    <div className="params"></div>
                    <div className="stdin"></div>
                </div>
            </div>
        );
    }
}
 
export default CargoWindow;

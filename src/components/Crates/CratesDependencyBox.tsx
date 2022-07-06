import { Sign } from "crypto";
import React from "react";
import { CratesDependency } from "../../classes/CratesDependency";

interface CratesDependencyBoxProps {
    dependency: CratesDependency,
    installed: boolean,
    onDownload: () => void
}
 
interface CratesDependencyBoxState {
}
 
class CratesDependencyBox extends React.Component<CratesDependencyBoxProps, CratesDependencyBoxState> {
    constructor(props: CratesDependencyBoxProps) {
        super(props);
        this.state = {};
    }

    render() { 
        return (
            <div className="crates-dependency">
                <div className="id">{this.props.dependency.id}</div>
                <div className="version"></div>
                <button className="install" onClick={() => this.props.onDownload()}>{this.props.installed? "installed" : "install"}</button>
            </div>
        );
    }
}
 
export default CratesDependencyBox;
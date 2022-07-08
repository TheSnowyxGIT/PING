import { Sign } from "crypto";
import React from "react";
import { CratesDependency } from "../../classes/CratesDependency";

interface CratesDependencyBoxProps {
    dependency: CratesDependency,
    installed: boolean,
    onDownload: () => void
    onRemove: () => void
}
 
interface CratesDependencyBoxState {
    isInstalled:boolean
}
 
class CratesDependencyBox extends React.Component<CratesDependencyBoxProps, CratesDependencyBoxState> {
    constructor(props: CratesDependencyBoxProps) {
        super(props);
        this.state = {isInstalled : this.props.installed};
    }

    render() { 
        return (
            <div className="crates-dependency">
                <div className="id">{this.props.dependency.id}</div>
                <div className="version"></div>
                <button className="install" onClick={() => {
                    if (this.state.isInstalled) {
                        this.props.onRemove();
                        this.setState({
                                isInstalled: false
                            }
                        )
                    }
                    else {
                        this.props.onDownload();
                        this.setState({
                            isInstalled: true
                        })
                    }
                }}>{this.state.isInstalled? "uninstall" : "install"}</button>
            </div>
        );
    }
}
 
export default CratesDependencyBox;
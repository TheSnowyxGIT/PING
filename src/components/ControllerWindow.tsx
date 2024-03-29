import React, { ReactElement } from "react";
import ProjectWindow from "./ProjectWindow/ProjectWindow";
import {Project} from "../classes/Project"
import { CategoryMenuType, getCategoryData } from "../classes/CategoryMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import CargoWindow from "./CargoWindow/CargoWindow";
import CratesIOWindow from "./Crates/CratesIOWindow";

interface ControllerWindowProps {
    project: Project | null,
    category: CategoryMenuType
}
 
interface ControllerWindowState {
    
}
 
class ControllerWindow extends React.Component<ControllerWindowProps, ControllerWindowState> {
    constructor(props: ControllerWindowProps) {
        super(props);
        this.state = {};
    }
    render() { 
        const projectOpened = this.props.project;
        const categoryData = getCategoryData(this.props.category);

        let activeWindow: ReactElement | null  = null;
        switch (this.props.category) {
            case CategoryMenuType.FileExplorer:
                activeWindow = <ProjectWindow 
                    rootNode={projectOpened ? projectOpened.rootNode : null}
                    selectedNode={projectOpened ? projectOpened.selectedNode : null}
                />
                break;
            case CategoryMenuType.Cargo:
                activeWindow = <CargoWindow 
                />
                break;
            case CategoryMenuType.CratesIO:
                activeWindow = <CratesIOWindow />
                break;
            default:
                break;
        }

        return (
            <div className="controllerWindow">
                <div className="header">
                    <span>{categoryData.title}</span>
                    <div className="options" onClick={() => console.log(this.props.category)}>
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                {activeWindow}
            </div>
        );
    }
}
 
export default ControllerWindow;

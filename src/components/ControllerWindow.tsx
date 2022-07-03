import React, { ReactElement } from "react";
import ProjectWindow from "./ProjectWindow/ProjectWindow";
import {Project} from "../classes/Project"
import { CategoryMenuType } from "../classes/CategoryMenu";

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

        let activeWindow: ReactElement | null  = null;
        switch (this.props.category) {
            case CategoryMenuType.FileExplorer:
                activeWindow = <ProjectWindow 
                    rootNode={projectOpened ? projectOpened.rootNode : null}
                    selectedNode={projectOpened ? projectOpened.selectedNode : null}
                />
                break;
            default:
                break;
        }

        return (
            <div className="controllerWindow">
                {activeWindow}
            </div>
        );
    }
}
 
export default ControllerWindow;

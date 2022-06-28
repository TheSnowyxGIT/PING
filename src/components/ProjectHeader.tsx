import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFolderPlus, faFileCirclePlus} from "@fortawesome/free-solid-svg-icons"
import { convertTypeAcquisitionFromJson } from "typescript";

interface ProjectHeaderProps {
    name: String;
    onNewFileClick: () => void;
}
 
interface ProjectHeaderState {
    
}
  
class ProjectHeader extends React.Component<ProjectHeaderProps, ProjectHeaderState> {
    constructor(props: ProjectHeaderProps) {
        super(props);
        this.state = {};
    }

    private addFolder(): void{
        console.log("addFolder");
    };

    render() { 
        return (
            <div className="project-header">
                <div className="project-name">{this.props.name}</div>
            <div className="buttons">
                <div className="add-file" onClick={() => this.props.onNewFileClick()}>
                   <FontAwesomeIcon icon={faFileCirclePlus}/>
                </div>
                <div className="add-folder" onClick={() => this.addFolder()}>
                    <FontAwesomeIcon icon={faFolderPlus}/>
                </div>
            </div>
            </div>
        );
    }
}
 
export default ProjectHeader;

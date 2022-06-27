import React from "react";
import { Project } from "../classes/Project";
import ProjectHeader from "./ProjectHeader";
import { Tree } from "./Tree";

interface ProjectWindowProps {
    project: Project;
}
 
interface ProjectWindowState {
    
}
 
class ProjectWindow extends React.Component<ProjectWindowProps, ProjectWindowState> {
    constructor(props: ProjectWindowProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <div>
                <ProjectHeader name={this.props.project.rootName}/>
                <Tree node={this.props.project.files}/>
            </div>
        );
    }
}
 
export default ProjectWindow;
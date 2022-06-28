import React from "react";
import { Project } from "../classes/Project";
import ProjectHeader from "./ProjectHeader";
import { Tree } from "./Tree";

interface ProjectWindowProps {
    project: Project | null;
}
 
interface ProjectWindowState {
    
}
 
class ProjectWindow extends React.Component<ProjectWindowProps, ProjectWindowState> {
    constructor(props: ProjectWindowProps) {
        super(props);
        this.state = {};
    }
    render() {

        if (this.props.project === null)
            return null;

        return (
            <div className="projectWindow">
                <ProjectHeader name={this.props.project.rootNode.name}/>
                <Tree node={this.props.project.rootNode} padding={0}/>
            </div>
        );
    }
}
 
export default ProjectWindow;

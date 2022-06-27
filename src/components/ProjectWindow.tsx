import React from "react";
import ProjectHeader from "./ProjectHeader";
import { FilesTree, Tree } from "./Tree";

interface ProjectWindowProps {
    projectName: string;
    fileTree: FilesTree;

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
                <ProjectHeader name={this.props.projectName}/>
                <Tree node={this.props.fileTree}/>
            </div>
        );
    }
}
 
export default ProjectWindow;
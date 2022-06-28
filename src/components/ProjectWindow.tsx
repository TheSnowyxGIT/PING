import React from "react";
import { FileNode } from "../classes/FileNode";
import { Project } from "../classes/Project";
import { NodeType } from "../shared/ideEnums";
import ProjectHeader from "./ProjectHeader";
import { Tree } from "./Tree";

interface ProjectWindowProps {
    rootNode: FileNode;
}
 
interface ProjectWindowState {
    selectNode: FileNode | null
}
 
class ProjectWindow extends React.Component<ProjectWindowProps, ProjectWindowState> {
    private rootNode: React.RefObject<Tree>;

    constructor(props: ProjectWindowProps) {
        super(props);
        this.state = { selectNode: null };
        this.rootNode = React.createRef();
    }

    onSelected(node: FileNode){
        this.setState({selectNode: node});
    }

    async onNewFileClicked(){
        if (this.rootNode.current){
            let selectedFolderNode = this.state.selectNode || this.props.rootNode;
            if (selectedFolderNode.type !== NodeType.FOLDER){
                if (selectedFolderNode.parent){
                    selectedFolderNode = selectedFolderNode.parent;
                }
            }
            console.log(selectedFolderNode)
            let fileName = await this.rootNode.current.getInputNewNode(selectedFolderNode)
            if (fileName !== ""){
                window.electron.createFile(selectedFolderNode.relativePath, fileName);
            }
        }
    }

    render() {
        return (
            <div className="projectWindow">
                <ProjectHeader 
                    name = {this.props.rootNode.name}
                    onNewFileClick = {() => this.onNewFileClicked()}
                />
                <Tree 
                    ref={this.rootNode}
                    node={this.props.rootNode}
                    padding={0}
                    onSelected={node => this.onSelected(node)}
                    selectedNode={this.state.selectNode}
                />
            </div>
        );
    }
}
 
export default ProjectWindow;

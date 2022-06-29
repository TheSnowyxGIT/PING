import React from "react";
import { FileNode } from "../classes/FileNode";
import { Project } from "../classes/Project";
import { NodeType } from "../shared/ideEnums";
import ProjectHeader from "./ProjectHeader";
import { Tree } from "./Tree";

interface ProjectWindowProps {
    rootNode: FileNode;
    selectedNode: FileNode | null;
    onSelected: (node: FileNode) => void;
}
 
interface ProjectWindowState {
}
 
class ProjectWindow extends React.Component<ProjectWindowProps, ProjectWindowState> {
    private rootNode_ref: React.RefObject<Tree>;

    constructor(props: ProjectWindowProps) {
        super(props);
        this.state = {};
        this.rootNode_ref = React.createRef();
    }

    async onNewFileClicked(){
        if (this.rootNode_ref.current){
            let selectedFolderNode = this.props.selectedNode || this.props.rootNode;
            if (selectedFolderNode.type !== NodeType.FOLDER){
                if (selectedFolderNode.parent){
                    selectedFolderNode = selectedFolderNode.parent;
                }
            }
            let fileName = await this.rootNode_ref.current.getInputNewNode(selectedFolderNode)
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
                    ref={this.rootNode_ref}
                    node={this.props.rootNode}
                    padding={0}
                    onSelected={node => this.props.onSelected(node)}
                    selectedNode={this.props.selectedNode}
                />
            </div>
        );
    }
}
 
export default ProjectWindow;

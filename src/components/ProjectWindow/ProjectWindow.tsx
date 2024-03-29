import React from "react";
import { FileNode } from "../../classes/FileNode";
import { NodeType } from "../../shared/ideEnums";
import ProjectHeader from "./ProjectHeader";
import { Tree } from "./Tree";

interface ProjectWindowProps {
    rootNode: FileNode | null;
    selectedNode: FileNode | null;
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
            if (selectedFolderNode == null)
                return;
            if (selectedFolderNode.type !== NodeType.FOLDER){
                if (selectedFolderNode.parent){
                    selectedFolderNode = selectedFolderNode.parent;
                }
            }
            let fileName = await this.rootNode_ref.current.getInputNewNode(selectedFolderNode)
            if (fileName !== ""){
                window.project.createFile.asyncSend({folderPath: selectedFolderNode.relativePath, name: fileName});
            }
        }
    }

    render() {
        
        let content = (<>
            <span>No Project</span>
        </>);
        if (this.props.rootNode !== null){
            content = (
                <>
                    {this.props.rootNode ? (<ProjectHeader 
                        name = {this.props.rootNode.name}
                        onNewFileClick = {() => this.onNewFileClicked()}/>) : null}
                    {this.props.rootNode ? (
                    <Tree 
                        ref={this.rootNode_ref}
                        node={this.props.rootNode}
                        padding={0}
                        selectedNode={this.props.selectedNode}
                    />) : null}
                </>
            )
        }

        return (
            <div className="projectWindow">
                {content}
            </div>
        );
    }
}
 
export default ProjectWindow;

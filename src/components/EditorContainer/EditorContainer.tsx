import React from "react";
import { FileEdit } from "../../classes/FileEdit";
import { FileNode } from "../../classes/FileNode";
import FilesHeader from "../FilesHeader/FilesHeader";
import Editor from "./Editor";

interface EditorContainerProps {
    isProjectOpened: boolean
    selectedFile: FileNode | null;
    files: FileEdit[];
}
 
interface EditorContainerState {
    
}
 
class EditorContainer extends React.Component<EditorContainerProps, EditorContainerState> {
    constructor(props: EditorContainerProps) {
        super(props);
        this.state = { };
    }

    /**
     * get The fileEdit who refer the given FileNode. null if does not exists
     */
    findFileEdit(node: FileNode | null) {
        if (node === null)
            return null;
        let match_files = this.props.files.filter(fileEdit => fileEdit.file.equals(node))
        if (match_files.length === 0){
            return null;
        }
        return match_files[0];
    }

    render() { 
        const selectedFileEdit = this.findFileEdit(this.props.selectedFile);

        return (
            this.props.isProjectOpened ? 
            (<div className="editor-container">
                <FilesHeader 
                    openedFiles={this.props.files.map(fileEdit => fileEdit)}
                    selectedFile={this.props.selectedFile}
                />
                {selectedFileEdit ? (<Editor 
                    fileEdit={selectedFileEdit} 
                />) : 
                    <div className="emptyProject">
                        <h1>No file opened</h1>
                    </div>
                }
            </div>)
            :
            <div className="editor-container">
                <div className="emptyProject">
                    <h1>No Opened Project</h1>
                </div>
            </div>
        );
    }
}
 
export default EditorContainer;

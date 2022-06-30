import React from "react";
import { FileEdit } from "../../classes/FileEdit";
import { FileNode } from "../../classes/FileNode";
import FilesHeader from "../FilesHeader/FilesHeader";
import Editor from "./Editor";

interface EditorContainerProps {
    isProjectOpened: boolean
    selectedFile: FileNode | null;
    files: FileEdit[];
    onBoxClose: (node: FileNode) => void;
    onBoxSelecte: (node: FileNode) => void;
    onContentChange: (data: string, nodeEdit: FileEdit) => void;
    onSave: (nodeEdit: FileEdit) => void;
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
            <>
                <FilesHeader 
                    openedFiles={this.props.files.map(fileEdit => fileEdit)}
                    selectedFile={this.props.selectedFile}
                    onClose={node => this.props.onBoxClose(node)}
                    onSelect={node => this.props.onBoxSelecte(node)}
                />
                {selectedFileEdit ? (<Editor 
                    fileEdit={selectedFileEdit} 
                    onChange={data => {this.props.onContentChange(data, selectedFileEdit)}}
                    onSave={this.props.onSave.bind(this)}
                />) : (<div className="emptyProject">
                    {!this.props.isProjectOpened ? <h1>No Opened Project</h1> : null}
                </div>
                )}
            </>
        );
    }
}
 
export default EditorContainer;

import React from "react";
import { FileEdit } from "../../classes/FileEdit";
import { FileNode } from "../../classes/FileNode";
import FileBox from "./FileBox";

interface FilesHeaderProps {
    openedFiles: FileNode[]
    selectedFile: FileNode | null
    onClose: (node: FileNode) => void;
    onSelect: (node: FileNode) => void;
}
 
interface FilesHeaderState {
    
}
 
class FilesHeader extends React.Component<FilesHeaderProps, FilesHeaderState> {
    constructor(props: FilesHeaderProps) {
        super(props);
        this.state = { };
    }
    render() { 
        return (
            <div className="filesHeader">
                <div className="files">
                    {
                        this.props.openedFiles.map(file => {
                            return (<FileBox 
                                name={file.name} 
                                active={this.props.selectedFile ? file.equals(this.props.selectedFile) : false}
                                onClick={() => this.props.onSelect(file)}
                                onClose={() => this.props.onClose(file)}
                            />)
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default FilesHeader;

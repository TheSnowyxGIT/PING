import React from "react";
import { FileEdit } from "../../classes/FileEdit";
import { FileNode } from "../../classes/FileNode";
import { Ide } from "../../classes/Ide";
import FileBox from "./FileBox";

interface FilesHeaderProps {
    openedFiles: FileEdit[]
    selectedFile: FileNode | null
}
 
interface FilesHeaderState {
    
}
 
class FilesHeader extends React.Component<FilesHeaderProps, FilesHeaderState> {
    constructor(props: FilesHeaderProps) {
        super(props);
        this.state = { };
    }

    render() {
        const projectOpened = Ide.getInstance().opened_project;
        if (!projectOpened || !this.props.selectedFile)
            return null;

        return (
            <div className="filesHeader">
                <div className="files">
                    {
                        this.props.openedFiles.map(file => {
                            return (<FileBox 
                                name={file.file.name} 
                                active={this.props.selectedFile ? file.file.equals(this.props.selectedFile) : false}
                                onClick={() => projectOpened.select(file.file)}
                                onClose={() => projectOpened.closeFile(file.file)}
                            />)
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default FilesHeader;

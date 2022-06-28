import React from "react";
import { FileNode } from "../../classes/FileNode";
import FileBox from "./FileBox";

interface FilesHeaderProps {
    openedFiles: FileNode[]
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
                            return (<FileBox name={file.name}/>)
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default FilesHeader;

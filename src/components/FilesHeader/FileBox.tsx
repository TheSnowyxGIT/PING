import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {faDeaf, faXmark} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { FileNode } from "../../classes/FileNode";

interface FileBoxProps {
    name: string,
    icon?: IconProp,
    onClose: () => void,
    onClick: () => void,
    active?: boolean,
}
 
interface FileBoxState {
    
}
 
class FileBox extends React.Component<FileBoxProps, FileBoxState> {
    constructor(props: FileBoxProps) {
        super(props);
        this.state = {  };
    }

    onClicked(event: React.MouseEvent){
        if (!(event.target as Element).classList.contains("close")){
            this.props.onClick();
        } else {
            this.props.onClose();
        }
    }

    render() { 
        return (
            <div className={["FileBox", this.props.active ? "active" : ""].join(" ")} onClick={event => this.onClicked(event)}>
                <div className="icon">
                   <FontAwesomeIcon icon={this.props.icon || faDeaf}/> 
                </div>
                <div className="nameContainer">
                    <div className="name">{this.props.name}</div>
                </div>
                <div className="close">
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        );
    }
}
 
export default FileBox;

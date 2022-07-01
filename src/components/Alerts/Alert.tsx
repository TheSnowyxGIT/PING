import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faInfoCircle, faExclamationCircle} from "@fortawesome/free-solid-svg-icons"
import {IconDefinition} from "@fortawesome/fontawesome-common-types"

export enum AlertType {
    ERROR,
    INFO
}

export interface AlertProps {
    type: AlertType;
    title: string;
    content: string;
}
 
interface AlertState {
}
 
export class Alert extends React.Component<AlertProps, AlertState> {


    constructor(props: AlertProps) {
        super(props);
        this.state = {};
    }

    getIcon(type: AlertType): IconDefinition {
        if (type === AlertType.ERROR){
            return faExclamationCircle;
        }
        return faInfoCircle;
    }

    getClassNameType(type: AlertType): string {
        if (type === AlertType.ERROR){
            return "error";
        }
        return "info";
    }

    getPrefix(type: AlertType): string {
        if (type === AlertType.ERROR){
            return "Error:";
        }
        return "Info:";
    }

    render() { 
        return (
            <div className={["AlertBox", this.getClassNameType(this.props.type)].join(" ")}>
                <div className="header">
                    <FontAwesomeIcon icon={this.getIcon(this.props.type)}></FontAwesomeIcon>
                    <span className="prefix">{this.getPrefix(this.props.type)}</span>
                    <span className="title">{this.props.title}</span>
                </div>
                <div className="content">
                    <span>{this.props.content}</span>
                </div>
            </div>
        );
    }
}
 


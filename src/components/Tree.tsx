import React, {MouseEvent } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronRight, faChevronDown, faFolder, faFile} from "@fortawesome/free-solid-svg-icons"
import { FileNode } from "../classes/FileNode";
import { NodeType } from "../shared/ideEnums";


interface TreeProps {
  node: FileNode;
  padding: number
}

interface TreeState {
  isCollapse: boolean;
}
 
export class Tree extends React.Component<TreeProps, TreeState> {
  public static padding_width = 10; // px

  constructor(props: TreeProps) {
    super(props);
    this.state = {isCollapse : false};
  }

  private getInfoClass(): string {
    if (this.props.node.type === NodeType.FOLDER)
      return "folder";
    else if (this.props.node.type === NodeType.FILE)
      return "file";
    return "file";
  }

  private onCollapseClick(event: MouseEvent) {
      this.setState({
        isCollapse: !this.state.isCollapse
      })
  }
  
  render() {
    return (
      <div className="tree-node">
        <div 
          className={["info", this.getInfoClass()].join(" ")} 
          onClick={(event) => this.onCollapseClick(event)}
          style={{paddingLeft: `${this.props.padding}px`}}
        >
          <div className="collapse">
            <FontAwesomeIcon icon={ this.state.isCollapse ? faChevronDown : faChevronRight}/>
          </div>
          <FontAwesomeIcon className="icon" icon={this.props.node.type === NodeType.FOLDER ? faFolder : faFile} />
          <div className="name">{this.props.node.name}</div>
        </div>
        <div className="children">
        {
          this.state.isCollapse ?
          this.props.node.children.map(child => {
            return (
              <Tree node={child} padding={this.props.padding + Tree.padding_width}/>
            );})
          : null
        }
        </div>
      </div>
    );
  }  
}

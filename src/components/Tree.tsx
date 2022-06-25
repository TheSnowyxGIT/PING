import React, { ReactElement, MouseEvent } from "react";
import {FontAwesomeIcon}  from "@fortawesome/react-fontawesome"
import {faChevronRight, faChevronDown, faFolder, faFile} from "@fortawesome/free-solid-svg-icons"

export enum NodeType{
    File,
    Folder,
    Other
}

export class FilesTree {
  public name: string;
  public childrens: FilesTree[];
  public type: NodeType;

  constructor(name: string, childrens: FilesTree[], type: NodeType) {
    this.name = name;
    this.childrens = childrens;
    this.type = type;
  }
}

interface TreeProps {
  node: FilesTree;
}

interface TreeState {
  isCollapse: boolean;
}
 
export class Tree extends React.Component<TreeProps, TreeState> {
  constructor(props: TreeProps) {
    super(props);
    this.state = {isCollapse : false};
  }

  private getInfoClass(): string {
    if (this.props.node.type === NodeType.Folder)
      return "folder";
    else if (this.props.node.type === NodeType.File)
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
        <div className={["info", this.getInfoClass()].join(" ")}>
          <div className="collapse" onClick={(event) => this.onCollapseClick(event)}>
            <FontAwesomeIcon icon={ this.state.isCollapse ? faChevronDown : faChevronRight}/>
          </div>
          <FontAwesomeIcon icon={this.props.node.type === NodeType.Folder ? faFolder : faFile} />
          <div className="name">{this.props.node.name}</div>
        </div>
        <div className="children">
        {
          this.state.isCollapse ?
          this.props.node.childrens.map(child => {
            return (
              <Tree node={child}/>
            );})
          : null
        }
        </div>
      </div>
    );
  }  
}
import React, {MouseEvent, useEffect } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronRight, faChevronDown, faFolder, faFile} from "@fortawesome/free-solid-svg-icons"
import { FileNode } from "../classes/FileNode";
import { NodeType } from "../shared/ideEnums";
import { HighlightSpanKind } from "typescript";
import { resolve } from "node:path/win32";


interface TreeProps {
  node: FileNode;
  padding: number;
  onSelected: (node: FileNode) => void;
}

interface TreeState {
  isCollapse: boolean;
  isWriting: boolean;
  writingValue: string
  writingCallback: (name: string) => void;
  elRefs: React.RefObject<Tree>[]
}
 
export class Tree extends React.Component<TreeProps, TreeState> {
  public static padding_width = 10; // px
  public static collapse_width = 30; // px

  constructor(props: TreeProps) {
    super(props);
    this.state = {
      isCollapse : false,
      isWriting : false,
      writingValue: "",
      writingCallback: () => {},
      elRefs: Array(this.props.node.children.length).fill(undefined).map(() => React.createRef())
    }
  }

  componentWillReceiveProps(prevProps: Readonly<TreeProps>){
      if (prevProps.node.children.length !== this.props.node.children.length){
        this.setState(state => {
          return {
            elRefs: Array(this.props.node.children.length).fill(undefined).map((_, i) => state.elRefs[i] || React.createRef())
          }
        })
      }
      if (this.props.node.name === "src")
        console.log(prevProps.node.children.length, this.props.node.children.length)
  }

  

  private getInfoClass(): string {
    if (this.props.node.type === NodeType.FOLDER)
      return "folder";
    else if (this.props.node.type === NodeType.FILE)
      return "file";
    return "file";
  }

  private onCollapseClick(event: MouseEvent) {
      this.props.onSelected(this.props.node)
      this.setState({
        isCollapse: !this.state.isCollapse
      })
  }

  public async getInputNewNode(node: FileNode) : Promise<string> {
    return new Promise(async (resolve, _) => {
      if (node.type !== NodeType.FOLDER){
        if (node.parent === null){
          return resolve("")
        }
        node = node.parent;
      }
      if (node.relativePath === this.props.node.relativePath){
        if (this.state.isWriting)
          return resolve("");
        const callback = (name: string) => {
          this.setState({isWriting: false, writingValue: "", writingCallback: () => {}})
          resolve(name);
        }
        this.setState({isCollapse: true, isWriting: true, writingValue: "", writingCallback: callback});
      } else {
        let promises = [];
        for (let childRef of this.state.elRefs){
          if (childRef.current){
            promises.push(childRef.current.getInputNewNode(node))
          }
        }
        const results = await Promise.all(promises);
        const result = results.reduce((acc, cur) => cur !== "" ? cur : "", "");
        resolve(result);
      }
    })
  }

  public handleWritingUnfocus() {
    this.state.writingCallback(this.state.writingValue);
  }

  public handleWritingKeyDown(event: React.KeyboardEvent){
    if (event.key === "Enter"){
      this.state.writingCallback(this.state.writingValue);
    } else if (event.key === "Escape"){
      this.state.writingCallback("");
    }
  }
  
  render() {
    return (
      <div className="tree-node">
        <div 
          className={["info", this.getInfoClass()].join(" ")} 
          onClick={(event) => this.onCollapseClick(event)}
          style={{marginLeft: `${this.props.padding}px`}}
        >
          <div className="collapse" style={{flexBasis: Tree.collapse_width + "px"}}>
            <FontAwesomeIcon icon={ this.state.isCollapse ? faChevronDown : faChevronRight}/>
          </div>
          <FontAwesomeIcon className="icon" icon={this.props.node.type === NodeType.FOLDER ? faFolder : faFile} />
          <div className="name">{this.props.node.name}</div>
        </div>
        <div className="children">
        <div className="writingInput" style={{paddingLeft: `${this.props.padding + Tree.padding_width + Tree.collapse_width}px`}}>{
            this.state.isWriting ? (
            <input type="text"
              autoFocus={true}
              value={this.state.writingValue} 
              onChange={(e) => this.setState({writingValue: e.target.value})}
              onKeyDown={(e) => this.handleWritingKeyDown(e)}
              onBlur={() => this.handleWritingUnfocus()}
            />) : null
          }
        </div>
        {
          this.state.isCollapse ?
          this.props.node.children.map((child, i) => {
            return (
              <Tree 
                key={i}
                ref={this.state.elRefs[i]}
                node={child}
                padding={this.props.padding + Tree.padding_width}
                onSelected={node => this.props.onSelected(node)}
              />
            );})
          : null
        }
        </div>
      </div>
    );
  }  
}

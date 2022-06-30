import React from "react";
import { FileEdit } from "../classes/FileEdit";
import { FileNode } from "../classes/FileNode";
import { Ide } from "../classes/Ide";
import { Project } from "../classes/Project";
import { AlertType } from "../components/Alert";
import AlertQueue from "../components/AlertQueue";
import Editor from "../components/EditorContainer/Editor";
import EditorContainer from "../components/EditorContainer/EditorContainer";
import FilesHeader from "../components/FilesHeader/FilesHeader";
import ProjectWindow from "../components/ProjectWindow";
import { F_Node, F_Project } from "../shared/F_interfaces";
import { FeatureType } from "../shared/ideEnums";
import { Report } from "../shared/report";

interface MainProps {
    
}
 
interface MainState {
    ide: Ide;
}
 
class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = { ide: new Ide() };

        window.electron.onMenuCargoBuild(() => {
          window.electron.execFeature(FeatureType.CARGO_BUILD, {
            err: (chunk) => console.log(chunk)
          })
        })
    }

    onProjectOpened(report: Report<F_Project>) {
        if (!report.isSuccess){
          AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Open Project", content: report.message || "unknown"})
        } else {
          this.setState(state => {
            if (report.data)
              state.ide.setProject(Project.of(report.data))
            return {ide: state.ide}
          })
        }
      }
      

      onFileCreated(report: Report<F_Node>) {
        if (!report.isSuccess){
          AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Create new file", content: report.message || "unknown"})
        } else {
          this.setState(state => {
            if (report.data) {
              let project = state.ide.opened_project;
              if (project) {
                project.addNode(report.data);
              }
            }
            return {ide: state.ide}
          })
        }
      }
    
      onFolderCreated(report: Report<F_Node>) {
        if (!report.isSuccess){
          AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Create new folder", content: report.message || "unknown"})
        } else {
          this.setState(state => {
            if (report.data) {
              let project = state.ide.opened_project;
              if (project) {
                project.addNode(report.data);
              }
            }
            return {ide: state.ide}
          })
        }
      }

      async selectNode(node: FileNode | null) {
        if (this.state.ide.opened_project){
          this.state.ide.opened_project.setSelectedNode(node);
          if (node) {
            this.state.ide.opened_project.openFile(node).then(() => {
              this.setState(state => {
                return {ide: state.ide}
              })
            })
          } else {
            this.setState(state => {
              return {ide: state.ide}
            })
          }
        }
      }

      /**
       * Close the node by removing from the opened files
       */
      closeNode(node: FileNode) {
        this.setState(state => {
          if (state.ide.opened_project){
              state.ide.opened_project.closeFile(node);
          }
          return {ide: state.ide}
        })
      }

      // Only Localy
      updateFileContent(newContent: string, node: FileEdit){
        node.content = newContent;
        node.isModified = true;
        this.setState(state => {
          return {ide: state.ide}
        })
      }

      savefile(fileEdit: FileEdit){
        window.electron.savefile(fileEdit.file.relativePath, fileEdit.content).then(report => {
          if (!report.isSuccess){
            AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Save File", content: report.message || "unknown"})
          } else {
            fileEdit.isModified = false;
            this.setState({
              ide: this.state.ide
            })
          }
        })
      }

    
      componentDidMount(){
        window.electron.onProjectOpened((report) => this.onProjectOpened(report));
        window.electron.onFileCreated((report) => this.onFileCreated(report));
        window.electron.onFolderCreated((report) => this.onFolderCreated(report))
      }
    
    render() { 
        const projectOpened = this.state.ide.opened_project;
        const selectedNode = projectOpened?.selectedNode;
        const selectedFile = projectOpened?.selectedFile ?  projectOpened.selectedFile : null;
        let openFiles: FileNode[] = []
        selectedFile && (openFiles = [selectedFile])

        return (
          <div className="container">
            <div className="left">
                <ProjectWindow 
                        rootNode={projectOpened ? projectOpened.rootNode : null}
                        selectedNode={projectOpened ? projectOpened.selectedNode : null}
                        onSelected={(node) => this.selectNode(node)}
                />
            </div>
            <div className="right">
                <EditorContainer 
                  files={projectOpened ? projectOpened.filesOpened : []}
                  selectedFile={selectedFile}
                  onBoxClose={node => this.closeNode(node)}
                  onBoxSelecte={(node) => this.selectNode(node)}
                  onContentChange={(content, nodeEdit) => this.updateFileContent(content, nodeEdit)}
                  onSave={fileEdit => this.savefile(fileEdit)}
                  isProjectOpened={projectOpened !== null}
                />
            </div>
        </div>
        );
    }
}
 
export default Main;

import React from "react";
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

      selectNode(node: FileNode | null) {
        this.setState(state => {
          if (state.ide.opened_project){
             state.ide.opened_project.setSelectedNode(node);
             node && state.ide.opened_project.openFile(node);
          }
          return {ide: state.ide}
        })
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
                {projectOpened ? (<ProjectWindow 
                        rootNode={projectOpened.rootNode}
                        selectedNode={projectOpened.selectedNode}
                        onSelected={(node) => this.selectNode(node)}
                />) : (<>No Project</>)}
            </div>
            <div className="right">
                <EditorContainer 
                  files={projectOpened ? projectOpened.filesOpened : []}
                  selectedFile={selectedFile}
                  onBoxClose={node => this.closeNode(node)}
                  onBoxSelecte={(node) => this.selectNode(node)}
                  onContentChange={() => {}}
                />
            </div>
        </div>
        );
    }
}
 
export default Main;

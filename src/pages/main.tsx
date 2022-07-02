import React from "react";
import { FileNode } from "../classes/FileNode";
import { Ide } from "../classes/Ide";
import { Project } from "../classes/Project";
import AlertQueue from "../components/Alerts/AlertQueue";
import EditorContainer from "../components/EditorContainer/EditorContainer";
import ProjectWindow from "../components/ProjectWindow/ProjectWindow";
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
        this.state = { 
          ide: new Ide(() => {this.setState({ide: this.state.ide})}) 
        };
    }

    /* ---Listeners--- */

    onProjectOpened(report: Report<F_Project>) {
        if (!report.isSuccess){
          AlertQueue.showReport("Open Project", report);
        } else if (report.data) {
          this.state.ide.setProject(Project.of(report.data))
        }
    }

    onFileCreated(report: Report<F_Node>) {
      if (!report.isSuccess){
        AlertQueue.showReport("Create new file", report);
      } else if (report.data && this.state.ide.opened_project){
        this.state.ide.opened_project.addNode(report.data);
      }
    }
  
    onFolderCreated(report: Report<F_Node>) {
      if (!report.isSuccess){
        AlertQueue.showReport("Create new folder", report);
      } else if (report.data && this.state.ide.opened_project){
        this.state.ide.opened_project.addNode(report.data);
      }
    }

    /* ---/Listeners--- */

    // Set All listeners
    componentDidMount(){
      window.project.openProject.on((report) => this.onProjectOpened(report));
      window.project.createFile.on((report) => this.onFileCreated(report));
      window.project.createFolder.on((report) => this.onFolderCreated(report))
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
                />
            </div>
            <div className="right">
                <EditorContainer 
                  files={projectOpened ? projectOpened.filesOpened : []}
                  selectedFile={selectedFile}
                  isProjectOpened={projectOpened !== null}
                />
            </div>
        </div>
        );
    }
}
 
export default Main;

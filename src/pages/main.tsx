import React from "react";
import { CategoryMenu } from "../classes/CategoryMenu";
import { FileNode } from "../classes/FileNode";
import { Ide } from "../classes/Ide";
import { Project } from "../classes/Project";
import AlertQueue from "../components/Alerts/AlertQueue";
import ControllerWindow from "../components/ControllerWindow";
import EditorContainer from "../components/EditorContainer/EditorContainer";
import LeftMenu from "../components/LeftMenu/LeftMenu";
import ProjectWindow from "../components/ProjectWindow/ProjectWindow";
import { Terminal } from "../components/Terminal/Terminal";
import TerminalWindow from "../components/Terminal/TerminalWindow";
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
      console.log(report.data?.relativePath)
      if (!report.isSuccess){
        AlertQueue.showReport("Create new folder", report);
      } else if (report.data && this.state.ide.opened_project){
        this.state.ide.opened_project.addNode(report.data);
      }
    }

    onFileDeleted(report: Report<string>) {
      if (!report.isSuccess){
        AlertQueue.showReport("Remove File", report);
      } else if (report.data && this.state.ide.opened_project){
        this.state.ide.opened_project.removeNode(report.data);
      }
    }

    onFolderDeleted(report: Report<string>) {
      if (!report.isSuccess){
        AlertQueue.showReport("Remove Folder", report);
      } else if (report.data && this.state.ide.opened_project){
        this.state.ide.opened_project.removeNode(report.data);
      }
    }

    // only from external tools
    onFileContentChanged(report: Report<string>) {
      if (!report.isSuccess){
        AlertQueue.showReport("File changed", report);
      } else if (report.data && this.state.ide.opened_project){
        const relativePath = report.data;
        const project = this.state.ide.opened_project;
        let path_splited = relativePath.split(window.libraries.path.sep);
        let node_finded = project.rootNode.getChild(path_splited);
        if (node_finded) {
          const node = node_finded;
          let filtered_nodes = project.filesOpened.filter(fileEdit => fileEdit.file.equals(node))
          if (filtered_nodes.length > 0){
            const fileEdit = filtered_nodes[0];
            fileEdit.onExternalContent();
          }
        }
      }
    }

    /* ---/Listeners--- */

    // Set All listeners
   componentDidMount(){
      window.project.openProject.on((report) => this.onProjectOpened(report));
      window.project.createFile.on((report) => this.onFileCreated(report));
      window.project.createFolder.on((report) => this.onFolderCreated(report));
      window.project.deleteFile.on((report) => this.onFileDeleted(report));
      window.project.deleteFolder.on((report) => this.onFolderDeleted(report));
      window.project.fileChange.on((report) => this.onFileContentChanged(report));
    }
  
    render() { 
        const projectOpened = this.state.ide.opened_project;
        const selectedNode = projectOpened?.selectedNode;
        const selectedFile = projectOpened?.selectedFile ?  projectOpened.selectedFile : null;
        const categoryMenu = this.state.ide.categoryMenu;

        const terminalOpened: boolean = this.state.ide.featureExecutor.getTerminalOpened();
        
        return (
          <div className="container">
            <div className="left">
                <LeftMenu/>
                <ControllerWindow project={projectOpened} category={categoryMenu.getSelectedType()}/>
            </div>
            <div className="right">
                <EditorContainer 
                  files={projectOpened ? projectOpened.filesOpened : []}
                  selectedFile={selectedFile}
                  isProjectOpened={projectOpened !== null}
                />
                {terminalOpened ? <TerminalWindow/> : null}
            </div>
        </div>
        );
    }
}
 
export default Main;

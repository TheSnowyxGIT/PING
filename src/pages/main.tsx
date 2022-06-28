import React from "react";
import { Ide } from "../classes/Ide";
import { Project } from "../classes/Project";
import { AlertType } from "../components/Alert";
import AlertQueue from "../components/AlertQueue";
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
              let project = state.ide.getOpenedProject();
              if (project) {
                project.addNode(report.data);
              }
            }
            return {ide: state.ide}
          })
        }
      }
    
      componentDidMount(){
        window.electron.onProjectOpened((report) => this.onProjectOpened(report));
        window.electron.onFileCreated((report) => this.onFileCreated(report));
      }
    
    render() { 
        return ( <div>Salut</div> );
    }
}
 
export default Main;

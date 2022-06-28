import React from 'react';
import { Ide } from './classes/Ide';
import AlertQueue from './components/AlertQueue';
import CssTest from './pages/cssTests';



interface AppProps {
  
}
 
interface AppState {

}
 
class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = { };

    
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

  onFolderCreated(report: Report<F_Node>) {
    if (!report.isSuccess){
      AlertQueue.sendAlert({time: 3000, type: AlertType.ERROR, title: "Create new folder", content: report.message || "unknown"})
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
    window.electron.onFolderCreated((report) => this.onFolderCreated(report))
  }

  render() { 
    return (
      <div className="App">
        <button onClick={() => {
          window.electron.createFile("src", "romain.cpp");
        }}>Create basic file</button>
          <button onClick={() => {
          window.electron.createFolder("src", "YES");
        }}>Create folder</button>
        <p>{this.state.ide.getOpenedProject()?.rootNode.path}</p>
        <ProjectWindow project={this.state.ide.getOpenedProject()} />
       <AlertQueue />
      </div>
    );
  }
}



export default App;

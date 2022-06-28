import React from "react";
import { FileNode } from "../classes/FileNode";
import { Project } from "../classes/Project";
import Editor from "../components/Editor";
import FilesHeader from "../components/FilesHeader/FilesHeader";
import ProjectWindow from "../components/ProjectWindow";
import { NodeType } from "../shared/ideEnums";

interface CssTestProps {
    
}
 
interface CssTestState {
    
}
 
class CssTest extends React.Component<CssTestProps, CssTestState> {
    private project;

    constructor(props: CssTestProps) {
        super(props);
        this.state = {  };

        const child2_1 = new FileNode("path","path","file2", NodeType.FILE,[])
        const child1_1 = new FileNode("path","path","file1", NodeType.FILE,[])
        const child1_2 = new FileNode("path","path","dir1", NodeType.FOLDER,[child2_1])
        const root = new FileNode("path","path","root", NodeType.FOLDER,[child1_1, child1_2])

        this.project = new Project(root, [])
    }

    


    render() { 
        return (
            <div className="container">
                <div className="left">
                    <ProjectWindow project={this.project}/>
                </div>
                <div className="right">
                    <FilesHeader openedFiles={[this.project.rootNode.children[0]]}/>
                    <Editor filePath="unknown" text="lala" />
                </div>
            </div>
        );
    }
}
 
export default CssTest;

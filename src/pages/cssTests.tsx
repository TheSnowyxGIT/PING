import React from "react";
import { FileNode } from "../classes/FileNode";
import { Project } from "../classes/Project";
import Editor from "../components/Editor";
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

        const child2_1 = new FileNode("","root/dir1/file2","file2", NodeType.FILE,[])
        const child1_1 = new FileNode("","root/file1","file1", NodeType.FILE,[])
        const child1_2 = new FileNode("","root/dir1","dir1", NodeType.FOLDER,[child2_1])
        const root = new FileNode("","root","root", NodeType.FOLDER,[child1_1, child1_2])

        this.project = new Project(root, [])
    }


    render() { 
        return (
            <div className="container">
                <div className="projectWindow">
                    <ProjectWindow rootNode={this.project.rootNode}/>
                </div>
                <div className="textEditor">
                    <Editor filePath="unknown" text="lala" />
                </div>
            </div>
        );
    }
}
 
export default CssTest;

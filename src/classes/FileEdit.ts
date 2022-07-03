
import AlertQueue from "../components/Alerts/AlertQueue";
import { FileNode } from "./FileNode";
import { Ide } from "./Ide";

/**
 * This class represent the state of a file in the editor
 */
export class FileEdit {

    // attributes
    public file: FileNode;
    private isModified = false;
    private content: string;


    // Contructor
    constructor(file: FileNode, content: string){
        this.file = file;
        this.content = content;
    }

    public setContent(content: string, update: boolean = true){
        this.content = content;
        this.isModified = true;
        update && Ide.getInstance().updateReact();
    }

    public getContent(){
        return this.content;
    }

    public save(update: boolean = true){
        window.project.savefile.syncSend({
            filePath: this.file.relativePath,
            content: this.getContent()
        }).then(report => {
            if (!report.isSuccess){
                AlertQueue.showReport("Save File", report)
            } else {
                this.isModified = false;
                update && Ide.getInstance().updateReact();
            }
        })
    }

    public async onExternalContent(){
        if (this.isModified){

        } else {
            const report = await window.project.getContentFile.syncSend({filePath: this.file.relativePath})
            if (!report.isSuccess){
                AlertQueue.showReport("Load Content of file", report);
            } else if (report.data){
                this.content = report.data;
            }
        }
        Ide.getInstance().updateReact();
    }
    
}

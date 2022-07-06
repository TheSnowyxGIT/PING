import * as chokidar from "chokidar"
import { MyProject } from "../entity/project"
import * as p from "path"
import { F_NodeFrom, MyNode } from "../entity/node";
import { BrowserWindow } from "electron";
import { Report } from "../../../src/shared/report";
import { F_Node } from "../../../src/shared/F_interfaces";

class WatchService {


    public async loadNode(folder: MyNode, name: string): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            MyNode.load(p.join(folder.getPath(), name), folder).then(node => resolve(node)).catch(err => reject(err))
        })
    }

    public async removeNode(node: MyNode){
        // Remove him self from the current parent
        let parent = node.getParent();
        if (parent !== null){
            let index = parent.getChildren().map(child => child.getName()).indexOf(node.getName());
            if (index >= 0)
                parent.getChildren().splice(index, 1);
        }
    }



}

export class ProjectWatcher {

    public static current_watcher: ProjectWatcher = null;

    private watcher_: chokidar.FSWatcher;
    private project_: MyProject;
    private ws_: WatchService;

    constructor(project: MyProject) {
        this.project_ = project;
        this.watcher_ = chokidar.watch(project.getRootNode().getPath(), {ignoreInitial: true, usePolling: true})
        this.ws_ = new WatchService();

        
        this.watcher_.on("add", this.onAdd.bind(this));
        this.watcher_.on("addDir", this.onAddDir.bind(this));
        this.watcher_.on("unlink", this.onUnlink.bind(this));
        this.watcher_.on("unlinkDir", this.onUnlinkDir.bind(this));
        this.watcher_.on("change", this.onChange.bind(this));
    }

    private getRelativePath(filepath: string){
        return p.relative(this.project_.getRootNode().getPath(), filepath);
    }

    onAdd(filepath: string){
        // filepath is inside root
        const relativePath = this.getRelativePath(filepath);
        const relativeFolderPath = p.dirname(relativePath);
        const filename = p.basename(relativePath);
        let folder = this.project_.getRootNode();
        if (relativeFolderPath !== "."){
            folder = folder.findChildRec(relativeFolderPath);
        }
        if (folder){
            this.ws_.loadNode(folder, filename).then(node => {
                if (node){
                    const windows = BrowserWindow.getAllWindows();
                    windows[0].webContents.send("createFile", Report.getReport<F_Node>({isSuccess: true, data: F_NodeFrom(node)}))
                }
            })
        } 
    }

    onAddDir(folderpath: string){
        // folderpath is inside root
        if (this.project_.getRootNode().getPath() === folderpath)
            return;
        const relativePath = this.getRelativePath(folderpath);
        const relativeFolderPath = p.dirname(relativePath);
        const foldername = p.basename(relativePath);
        let folder = this.project_.getRootNode();
        if (relativeFolderPath !== "."){
            folder = folder.findChildRec(relativeFolderPath);
        }
        if (folder){
            this.ws_.loadNode(folder, foldername).then(node => {
                if (node){
                     const windows = BrowserWindow.getAllWindows();
                    windows[0].webContents.send("createFolder", Report.getReport<F_Node>({isSuccess: true, data: F_NodeFrom(node)}))
                }
            })
        }
    }

    onUnlink(filepath: string) {
        // filepath is inside root
        const relativePath = this.getRelativePath(filepath);
        const filenode = this.project_.getRootNode().findChildRec(relativePath);
        if (filenode){
            const windows = BrowserWindow.getAllWindows();
            windows[0].webContents.send("deleteFile", Report.getReport<string>({isSuccess: true, data: filenode.getRelativePath()}))
            this.ws_.removeNode(filenode);
        }
    }

    onUnlinkDir(folderpath: string) {
        // filepath is inside root
        const relativePath = this.getRelativePath(folderpath);
        const foldernode = this.project_.getRootNode().findChildRec(relativePath);
        if (foldernode){
            const windows = BrowserWindow.getAllWindows();
            windows[0].webContents.send("deleteFolder", Report.getReport<string>({isSuccess: true, data: foldernode.getRelativePath()}))
            this.ws_.removeNode(foldernode);
        }
    }

    onChange(filepath: string){
        // filepath is inside root
        const relativePath = this.getRelativePath(filepath);
        const filenode = this.project_.getRootNode().findChildRec(relativePath);
        if (filenode){
            const windows = BrowserWindow.getAllWindows();
            windows[0].webContents.send("fileChange", Report.getReport<string>({isSuccess: true, data: filenode.getRelativePath()}))
        }
    }

    close(){
        this.watcher_.close();
    }
}

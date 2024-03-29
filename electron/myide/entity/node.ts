import * as fs from "fs";
import * as p from "path";
import { Report } from "../../../src/shared/report";
import { NodeType } from "../../../src/shared/ideEnums"
import { F_Node } from "../../../src/shared/F_interfaces";

export function F_NodeFrom(node: MyNode): F_Node {
    return {
        path: node.getPath(),
        relativePath: node.getRelativePath(),
        type: node.getType(),
        name: node.getName(),
        children: node.getChildren().map(child => F_NodeFrom(child))
    }
}

export class MyNode {

    private path_: string;
    private relativePath_;
    private type_: NodeType;
    private children_: MyNode[];
    private parent_: MyNode | null;
    private name_: string;


    /**
     * @param path The Path of the Node to load (non empty file/Folder/..)
     * @param parent Parent Folder Node, null if you want this Node to be the root
     * @return The Node loaded
     * @throws {Report | Error}
     */
    public static load(path: string, parent: MyNode | null): Promise<MyNode> {
        return new Promise(async (resolve, reject) => {
            let rootNode: MyNode;
            let queue = [{parent: parent, path: path}];
            while (queue.length > 0){
                let promises: Promise<{stat: fs.Stats, path: string, parent: MyNode | null} | null>[] = []
                for (let cur_elt of queue){
                    promises.push(new Promise((resolve, _) => {
                        fs.stat(cur_elt.path, (err, stat) => {
                            if (err){
                                return resolve(null);
                            }
                            resolve({stat: stat, path: cur_elt.path, parent: cur_elt.parent});
                        });
                    }))
                }
                const files_data = await Promise.all(promises);
                queue = []
                let promises2: Promise<{parent: MyNode | null, paths: string[]} | null>[] = [];
                for (let file_data of files_data){
                    if (file_data === null){
                        continue;
                    }
                    let type = NodeType.OTHER;
                    if (file_data.stat.isFile())
                        type = NodeType.FILE;
                    if (file_data.stat.isDirectory())
                        type = NodeType.FOLDER;
                    let name = p.basename(file_data.path);
                    let relativePath = "";
                    if (file_data.parent !== null)
                        relativePath = p.join(file_data.parent.getRelativePath(), name);
                    let node = new MyNode(name, file_data.path, relativePath, type, file_data.parent);
                    if (rootNode === undefined){
                        rootNode = node;
                    }
                    if (file_data.parent){
                        file_data.parent.addChild(node);
                    }
                    if (type === NodeType.FOLDER){
                       promises2.push(new Promise((resolve, _) => {
                            fs.readdir(file_data.path, (err, files) => {
                                if (err){
                                    return resolve(null);
                                }
                                resolve({parent: node, paths: files.map(file => p.join(file_data.path, file))})
                            })
                       }))
                    }
                }
                const subfilesPerParent = await Promise.all(promises2);
                for (let subfiles of subfilesPerParent){
                    if (subfiles === null){
                        continue;
                    }
                    queue = queue.concat(subfiles.paths.map(subfile => {return {parent: subfiles.parent, path: subfile}}))
                }
            }
            resolve(rootNode);
        })
    }

    /**
     * Create a node as the root
     * @param path The Path of the Node to create (need to be an empty path)
     * @param type The Type of the Node
     * @return The created Node
     * @throws {Report | Error}
     */
    public static createRoot(path: string, type: NodeType): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.F_OK, err => {
                if (err){
                    let name = p.basename(path)
                    let node = new MyNode(name, path, "", type, null);
                    node.createFsObj()
                    return resolve(node);
                }
                return reject(Report.getReport({isSuccess: false, message: `FsObj already exists ${path}`}));
            });
        });
    }

    /**
     *
     * @param name Name of the file / folder / ...
     * @param type The Type of the Node
     * @param parent Parent Folder Node
     * @return The created Node
     * @throws {Report | Error}
     */
     public static async create(name: string, type: NodeType, parent: MyNode): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            let path = p.join(parent.getPath(), name);
            fs.access(path, fs.constants.F_OK, async err => {
                if (err){
                    let relativePath = "";
                    if (parent !== null)
                        relativePath = p.join(parent.getRelativePath(), name);
                    let node = new MyNode(name, path, relativePath, type, parent);
                    // Create FsObj
                    await node.createFsObj();
                    // add him self as new child of the parent folder
                    parent.addChild(node)
                    
                    return resolve(node);
                }
                return reject(Report.getReport({isSuccess: false, message: `FsObj already exists ${path}`}));
            });
        });
    }

    /**
     * Constructor
    */
    constructor(name: string, path: string, relativePath: string, type: NodeType, parent: MyNode | null){
        this.path_ = path;
        this.type_ = type;
        this.parent_ = parent;
        this.children_ = [];
        this.name_ = name;
        this.relativePath_ = relativePath;
    }

    public getParent(): MyNode | null {
        return this.parent_;
    }

    public getName(): string {
        return this.name_;
    }

     /**
     * @return The Node path.
     */
    public getPath(): string {
        return this.path_;
    }

    
     /**
     * @return The Node relative.
     */
      public getRelativePath(): string {
        return this.relativePath_;
    }

    /**
     * @return The Node type.
     */
    public getType(): NodeType {
        return this.type_;
    }

    /**
     * If the Node is a Folder, returns a list of its children,
     * else returns an empty list.
     *
     * @return List of node
     */
    public getChildren(): MyNode[] {
        return this.children_;
    }

    public addChild(node: MyNode){
        if (!this.children_.some(child => child.getPath() === node.getPath()))
            this.children_.push(node);
    }

    public isFile(): boolean {
        return this.getType() === NodeType.FILE;
    }

    public isFolder(): boolean {
        return this.getType() === NodeType.FOLDER;
    }

    public prettyPrint(): void {
        console.log("TODO");
    }

    private createFsObj(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.type_ == NodeType.FOLDER) {
                fs.mkdir(this.path_, err => {
                    if (err){
                        return reject(new Error(`Failed to create the directory at ${this.path_}`));
                    }
                    resolve();
                });
            } else if (this.type_ == NodeType.FILE){
                fs.closeSync(fs.openSync(this.path_, 'w'));
                resolve();
            } else{
                return reject(new Error(`Creation for the type ${this.type_} not implemented`));
            }
        })
    }

    /**
     * @return All content of the Node, null if the Node is not a file
     * @throws
     */
    public getFileUTF8Content(): string | null {
        if (!this.isFile())
            return null;
        return fs.readFileSync(this.path_, {encoding: 'utf8'});
    }

    
    /**
     * Delete The Node
     * @return true if succeed, false otherwise
     */
     public delete(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.rmSync(this.path_, {recursive: true})
                // Remove him self from the current parent
                let parent = this.getParent();
                if (parent !== null){
                    let index = parent.getChildren().map(child => child.getName()).indexOf(this.getName());
                    if (index >= 0)
                        parent.getChildren().splice(index, 1);
                }
                resolve(true);
            } catch (err) {
                resolve(false);
            }
        });
    }

    /**
     * Move the Node to another folder Node
     * @param dest The Node destination (must be a folder)
     * @return The Node moved (this)
     * @throws IOException
     */
     public move(dest: MyNode): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            if (!dest.isFolder()){
                return reject(Report.getReport({isSuccess: false, message: "Can only move into directories"}));
            }
            // Remove him self from the current parent
            let parent = this.getParent();
            if (parent !== null){
                let index = parent.getChildren().map(child => child.getName()).indexOf(this.getName());
                if (index >= 0)
                    parent.getChildren().splice(index, 1);
            }
            // Move the FsObj with the fileSystem into the dest folder
            let newPath = p.join(dest.getPath(), this.getName());
            fs.rename(this.path_, newPath, err => {
                if (err){
                    return reject(Report.getReport({isSuccess: false, message: `Failed to move ${this.path_} to ${dest.getPath()}`}));
                }
                // Add him self as new child of the dest folder
                dest.addChild(this);
                // update his path and his parent
                this.parent_ = dest;
                this.path_ = newPath;
                resolve(this);
            })
        })
    }

    /**
     * Only children with 1 of depth
     * @param name Name of the File / Folder
     * @return The child node if exists, null otherwise
     */
    public findChild(name: string): MyNode | null{
        for (let child of this.getChildren()){
            if (child.getName() === name){
                return child;
            }
        }
        return null;
    }

    /**
     * Search in all children recursively
     * @param path The path of the Node
     * @return The node if exists, null otherwise
     */
    public findChildRec(path: string): MyNode | null {
        let fileName = path.split(p.sep)[0];
        for (let child of this.getChildren()){
            if (child.getName() === fileName){
                if (path.split(p.sep).length === 1){
                    return child;
                } else {
                    let path_splited = path.split(p.sep);
                    path_splited.splice(0,1);
                    let subpath = p.join.apply(null, path_splited);
                    return child.findChildRec(subpath);
                }
            }
        }
        return null;
    }
}

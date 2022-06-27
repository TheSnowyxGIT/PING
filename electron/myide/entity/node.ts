import * as fs from "fs";
import * as p from "path";
import { Report } from "../../../src/shared/report";
import { NodeType } from "../../../src/shared/ideEnums"
import { F_Node } from "../../../src/shared/F_interfaces";

export function F_NodeFrom(node: MyNode): F_Node {
    return {
        path: node.getPath(),
        type: node.getType(),
        name: node.getName(),
        children: node.getChildren().map(child => F_NodeFrom(child))
    }
}

export class MyNode {

    private path_: string;
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
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.F_OK, err => {
                if (err){
                    return reject(Report.getReport({isSuccess: false, message: `Cannot access to the given path ${path}`}));
                }
                fs.lstat(path, (err, stat) => {
                    if (err){
                        return reject(Report.getReport({isSuccess: false, message: `Lstat failed for the given path ${path}`}));
                    }
                    let type = NodeType.OTHER;
                    if (stat.isFile())
                        type = NodeType.FILE;
                    if (stat.isDirectory())
                        type = NodeType.FOLDER;
                    let name = p.basename(path)
                    let node = new MyNode(name, path, type, parent);
                    if (type === NodeType.FOLDER){
                        fs.readdir(path, async (err, files) => {
                            if (err){
                                return reject(Report.getReport({isSuccess: false, message: `Failed to read the directory ${path}`}));
                            }
                            for (let file of files){
                                let child = await MyNode.load(p.join(path, file), node);
                                node.children_.push(child);
                            }
                            return resolve(node);
                        });
                    } else {
                        return resolve(node);
                    }
                });
            })
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
                    let node = new MyNode(name, path, type, null);
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
                    let node = new MyNode(name, path, type, parent);
                    // Create FsObj
                    await node.createFsObj();
                    // add him self as new child of the parent folder
                    parent.getChildren().push(node);
                    
                    return resolve(node);
                }
                return reject(Report.getReport({isSuccess: false, message: `FsObj already exists ${path}`}));
            });
        });
    }

    /**
     * Constructor
    */
    constructor(name: string, path: string, type: NodeType, parent: MyNode | null){
        this.path_ = path;
        this.type_ = type;
        this.parent_ = parent;
        this.children_ = [];
        this.name_ = name;
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
            fs.unlink(this.path_, err => {
                if (err){
                    resolve(false);
                }
                // Remove him self from the current parent
                let parent = this.getParent();
                if (parent !== null){
                    let index = parent.getChildren().map(child => child.getName()).indexOf(this.getName());
                    parent.getChildren().splice(index, 1);
                }
                // Reset attributes
                this.children_ = [];
                this.parent_ = null;
                resolve(true);
            });
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
                parent.getChildren().splice(index, 1);
            }
            // Move the FsObj with the fileSystem into the dest folder
            let newPath = p.join(dest.getPath(), this.getName());
            fs.rename(this.path_, newPath, err => {
                if (err){
                    return reject(Report.getReport({isSuccess: false, message: `Failed to move ${this.path_} to ${dest.getPath()}`}));
                }
                // Add him self as new child of the dest folder
                dest.getChildren().push(this);
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
            if (child.getName() == name){
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
        let fileName = path.split("/")[0];
        for (let child of this.getChildren()){
            if (child.getName() === fileName){
                if (path.split("/").length == 1){
                    return child;
                } else {
                    let path_splited = path.split("/");
                    path_splited.splice(0,1);
                    let subpath = p.join.apply(null, path_splited);
                    return this.findChildRec(subpath);
                }
            }
        }
        return null;
    }
}

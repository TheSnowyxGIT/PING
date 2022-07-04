import { MyNode } from "../entity/node"
import * as fs from "fs";
import { NodeType } from "../../../src/shared/ideEnums";
import { Report } from "../../../src/shared/report";
import * as p from "path"

export default class NodeService {

    // Singleton
    private static instance: NodeService;
    constructor(){
        if (NodeService.instance){
            return NodeService.instance;
        }
        NodeService.instance = this;
    }


    /**
     * Update the content in the range [from, to[.
     *
     * @param node            Node to update (must be a file).
     * @param from            Beginning index of the text to update.
     * @param to              Last index of the text to update (Not included).
     * @param insertedContent Content to insert.
     * @return The node that has been updated.
     * @throws Exception upon update failure.
     */
    public update(node: MyNode, from: number, to: number, insertedContent: Buffer): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            if (!node.isFile()){
                return reject(new Error(`The file to update need to be a file.`));
            }
            fs.readFile(node.getPath(), (err, fileContent) => {
                if (err){
                    return reject(new Error(`The reading of the file failed`));
                }
                if (from > to){
                    return reject(new Error(`'from' must be smaller than 'to'`))
                }
                if (from > fileContent.length){
                    return reject(new Error(`'from' must be smaller than the content of the file`))
                }
                if (to > fileContent.length){
                    to = fileContent.length;
                }
                let newBuffer = Buffer.alloc(fileContent.length + insertedContent.length - to + from);
                fileContent.copy(newBuffer, 0, 0, from);
                insertedContent.copy(newBuffer, from, 0, insertedContent.length);
                fileContent.copy(newBuffer, from + insertedContent.length, to, fileContent.length);

                fs.writeFile(node.getPath(), newBuffer, err => {
                    if (err){
                        return reject(new Error(`The writing of the file failed`));
                    }
                    resolve(node);
                });
            })
        })
    }

    /**
     * Overwrite the content.
     *
     * @param node  Node to overwrite (must be a file).
     * @param content Content to insert.
     * @return The node that has been overwrite.
     * @throws Exception upon update failure.
     */
    public overwrite(node: MyNode, content: Buffer): Promise<MyNode> {
        return new Promise((resolve, reject) => {
            if (!node.isFile()){
                return reject(new Error(`The file to update need to be a file.`));
            }
            fs.writeFile(node.getPath(), content, err => {
                if (err){
                    return reject(new Error(`The writing of the file failed`));
                }
                resolve(node);
            });
        })
    }

    /**
    * Delete the node given as parameter.
    *
    * @param node Node to remove.
    * @return True if the node has been deleted, false otherwise.
    */
    public async delete(node: MyNode): Promise<boolean> {
        return await node.delete();
    }
    
    /**
    * Create a new node.
    *
    * @param folder Parent node of the new node.
    * @param name   Name of the new node.
    * @param type   Type of the new node.
    * @return Node that has been created.
    * @throws Exception upon creation failure.
    */
    public async create(folder: MyNode, name: string, type: NodeType): Promise<MyNode> {
        if (!folder.isFolder()){
            throw Report.getReport({isSuccess: false, message: "The folder parent need to be a folder"})
        }
        let node = await MyNode.create(name, type, folder);
        return node;
    }

    /**
    * Move node from source to destination.
    *
    * @param nodeToMove        Node to move.
    * @param destinationFolder Destination of the node.
    * @return The node that has been moved.
    * @throws Exception upon move failure.
    */
    public async move(nodeToMove: MyNode, destinationFolder: MyNode): Promise<MyNode> {
        return await nodeToMove.move(destinationFolder);
    }

    
}

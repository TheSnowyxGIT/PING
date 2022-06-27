import { AspectType, NodeType } from "./ideEnums";

export interface F_Aspect {
    type: AspectType;
    name: string;
}
export interface F_Node {
    path: string,
    type: NodeType,
    children: F_Node[],
    name: string
}
export interface F_Project {
    rootNode: F_Node,
    aspects: F_Aspect[]
};

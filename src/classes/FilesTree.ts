export enum NodeType{
    File,
    Folder,
    Other
}

export class FilesTree {
  public name: string;
  public childrens: FilesTree[];
  public type: NodeType;

  constructor(name: string, childrens: FilesTree[], type: NodeType) {
    this.name = name;
    this.childrens = childrens;
    this.type = type;
  }
}
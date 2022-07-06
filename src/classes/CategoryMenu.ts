import { Ide } from "./Ide";

export enum CategoryMenuType {
    FileExplorer,
    Cargo,
    CratesIO
}

export interface CategoryData {
    title: string
}

export function getCategoryData(category: CategoryMenuType): CategoryData{
    if (category === CategoryMenuType.FileExplorer){
        return {
            title: "Explorator"
        }
    } else if (category === CategoryMenuType.Cargo){
        return {
            title: "Cargo"
        }
    } else if (category === CategoryMenuType.CratesIO) {
        return {
            title: "Dependencies"
        }
    } else {
        return {
            title: "UNKNOWN"
        }
    }
}


export class CategoryMenu {

    // Singleton
    private static instance: CategoryMenu;
    public static getInstance(){
        return this.instance;
    }


    // attributes
    private category_selected: CategoryMenuType = CategoryMenuType.Cargo;

    constructor(){
        if (CategoryMenu.instance){
            return CategoryMenu.instance;
        }
        
        CategoryMenu.instance = this;
    }

    public getSelectedType(): CategoryMenuType {
        return this.category_selected;
    }

    public select(category: CategoryMenuType, update: boolean = true){
        this.category_selected = category;
        console.log(category)
        update && Ide.getInstance().updateReact();
    }

}

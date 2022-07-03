import { Ide } from "./Ide";


export enum CategoryMenuType {
    FileExplorer,
    TAMERE
}


export class CategoryMenu {

    // Singleton
    private static instance: CategoryMenu;
    public static getInstance(){
        return this.instance;
    }


    // attributes
    private category_selected: CategoryMenuType = CategoryMenuType.TAMERE;

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
        update && Ide.getInstance().updateReact();
    }

}

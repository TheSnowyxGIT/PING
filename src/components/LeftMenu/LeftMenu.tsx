import React from "react";
import MenuItem from "./MenuItem";
import {faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons"
import { CategoryMenu, CategoryMenuType } from "../../classes/CategoryMenu";

interface LeftMenuProps {
    
}
 
interface LeftMenuState {
    
}
 
class LeftMenu extends React.Component<LeftMenuProps, LeftMenuState> {
    constructor(props: LeftMenuProps) {
        super(props);
        this.state = {  };
    }
    render() { 
        return ( 
            <div className="leftMenu">
                <MenuItem icon={faAngleDoubleRight} onClick={()=>{
                    CategoryMenu.getInstance().select(CategoryMenuType.FileExplorer)
                }}/>
                <MenuItem icon={faAngleDoubleRight} onClick={()=>{
                    CategoryMenu.getInstance().select(CategoryMenuType.CratesIO)
                }}/>
            </div>
         );
    }
}
 
export default LeftMenu;

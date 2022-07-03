import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface MenuItemProps {
    icon: IconProp,
    onClick: () => void
}
 
interface MenuItemState {
    
}
 
class MenuItem extends React.Component<MenuItemProps, MenuItemState> {
    constructor(props: MenuItemProps) {
        super(props);
        this.state = { };
    }
    render() { 
        return (
            <div className="menuItem" onClick={() => this.props.onClick()}>
                 <FontAwesomeIcon icon={this.props.icon}/> 
            </div>
        );
    }
}
 
export default MenuItem;

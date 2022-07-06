import React from "react";
import { Terminal } from "./Terminal";

interface TerminalWindowProps {
}
 
interface TerminalWindowState {
    
}
 
class TerminalWindow extends React.Component<TerminalWindowProps, TerminalWindowState> {


    // Singleton
    private static instance: TerminalWindow;
    public static getInstance(){
        return this.instance;
    }

    public terminal: React.RefObject<Terminal> = React.createRef();

    constructor(props: TerminalWindowProps) {
        if (TerminalWindow.instance){
            return TerminalWindow.instance;
        }
        super(props);
        this.state = {  };
        TerminalWindow.instance = this;
    }

    render() { 
        return (
            <div className="terminal-window">
                <div className="terminal-header">
                    <div className="header-left"></div>
                    <div className="header-right"></div>
                </div>
                <Terminal ref={this.terminal} />
            </div>
        );
    }
}
 
export default TerminalWindow;

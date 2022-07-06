import React, { FunctionComponent } from "react";
import { Stream } from "../../classes/utils/stream";

enum LineType {
    OUT,
    ERR
}

interface TerminalLineProps {
    prompt?: string;
    isInput: boolean;
    isActive: boolean;
    content: string;
    type: LineType
}
 
const TerminalLine: FunctionComponent<TerminalLineProps> = (props) => {
    let classes: string[] = ["terminal-line"];
    if (props.isActive){
        classes.push("terminal-input-active")
    }
    if (props.isInput){
        classes.push("terminal-input")
    }
    if (props.type === LineType.ERR){
        classes.push("terminal-stderr")
    } else {
        classes.push("terminal-stdout")
    }

    const customProps = {
        "data-prompt": props.prompt
    }

    return (
        <div className={classes.join(" ")} {...customProps}>
            {props.content}
        </div>
    );
}

interface TerminalLineData {
    content: string,
    type: LineType
}

interface TerminalProps {
}
 
interface TerminalState {
    lines: TerminalLineData[]
}
 
export class Terminal extends React.Component<TerminalProps, TerminalState> {

    public prompt = "$";

    constructor(props: TerminalProps) {
        super(props);
        this.state = {
            lines: [],
        };

        /*this.props.stream_err?.on("data", (data : string) => {
            const lines = data.split("\n");
            this.setState(state => {
                const newLines = state.lines.concat(lines.map<TerminalLineData>(line => {
                    return {content: line, type: LineType.ERR}
                }));
                return {
                    lines: newLines
                }
            })
        })

        this.props.stream_out?.on("end", () => {
            this.setState({
                isStderrFinished: true
            })
        })*/
    }

    pushStderr(data: string){
        const lines = data.split("\n");
        this.setState(state => {
            const newLines = state.lines.concat(lines.map<TerminalLineData>(line => {
                return {content: line, type: LineType.ERR}
            }));
            return {
                lines: newLines
            }
        })
    }

    pushStdout(data: string){
        const lines = data.split("\n");
        this.setState(state => {
            const newLines = state.lines.concat(lines.map<TerminalLineData>(line => {
                return {content: line, type: LineType.OUT}
            }));
            return {
                lines: newLines
            }
        })
    }

    clear(){
        this.setState({lines: []})
    }

    render() { 
        return (
            <div className="terminal-wrapper">
                <div className="terminal">
                    {this.state.lines.map(line => TerminalLine({prompt: this.prompt, content: line.content, isActive: false, isInput: false, type: line.type}))}
                </div>
                <input className="terminal-hidden-input" type="text" />
            </div>
        );
    }
}

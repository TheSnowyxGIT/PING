import { useState, KeyboardEvent } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";

import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/mode-rust"
import "ace-builds/src-noconflict/theme-twilight"
import "ace-builds/src-noconflict/ext-language_tools"
import { FileEdit } from "../../classes/FileEdit";
import React from "react";
 
interface EditorProps {
    fileEdit: FileEdit
    onChange: (value: string) => void
}
 
interface EditorState {
    
}
 
class Editor extends React.Component<EditorProps, EditorState> {
    public static fontSize: number = 17;

    constructor(props: EditorProps) {
        super(props);
        this.state = { };
    }

    render() { 
        return (
            <div style={{height: "100%"}}>
            <AceEditor
                placeholder=""
                defaultValue={this.props.fileEdit.content}
                mode="rust"
                theme="twilight"
                name="Editor"
                onChange={data => this.props.onChange(data)}
                value={this.props.fileEdit.content}
                fontSize={Editor.fontSize}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                width="100%"
                height="100%"
                setOptions={{
                    useWorker: false,
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                }}
            />
        </div>
        );
    }
}
 
export default Editor;

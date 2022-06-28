import { useState, KeyboardEvent } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";

import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/mode-rust"
import "ace-builds/src-noconflict/theme-twilight"
import "ace-builds/src-noconflict/ext-language_tools"

interface EditorProps {
    text: string,
    filePath: string
}

const Editor = (props: EditorProps) => {

    const [value, setValue] = useState(props.text);
    const [fontSize, setFontSize] = useState(17);
    const [textHasChanged, setTextHasChanged] = useState(false);

    function onChange(value: string){
        setValue(value);
        setTextHasChanged(true);
    }

    return (
        <div style={{height: "100%"}}>
            <AceEditor
                placeholder=""
                defaultValue={props.text}
                mode="rust"
                theme="twilight"
                name="Editor"
                onChange={onChange}
                value={value}
                fontSize={fontSize}
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


export default Editor;

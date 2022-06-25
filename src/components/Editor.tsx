import { useState, KeyboardEvent } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";

import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/mode-rust"
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"

interface EditorProps {
    text: string,
    filePath: string
}

const Editor = (props: EditorProps) => {

    const [value, setValue] = useState(props.text);
    const [fontSize, setFontSize] = useState(14);
    const [textHasChanged, setTextHasChanged] = useState(false);


    function saveFile(){
        if (textHasChanged){
            let report = window.electron.saveFile({
                data: new TextEncoder().encode(value),
                path: props.filePath
            })
            console.log("SaveFile report", report)
        }
    }

    function onChange(value: string){
        setValue(value);
        setTextHasChanged(true);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>){
        if((event.ctrlKey || event.metaKey) && event.code === 'KeyS') {
            event.preventDefault();
            saveFile();
        }
    }

    return (
        <div onKeyDown={handleKeyDown} >
            <AceEditor
                placeholder=""
                defaultValue={props.text}
                mode="rust"
                theme="monokai"
                name="Editor"
                onChange={onChange}
                value={value}
                fontSize={fontSize}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
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

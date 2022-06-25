import { useState, KeyboardEvent } from 'react';
import Editor from "./components/Editor"

function App() {

  const [text, setText] = useState("");

  return (
    <div className="App">
      <Editor text={''} filePath={"file/path/test"} />
    </div>
  );
}

export default App;

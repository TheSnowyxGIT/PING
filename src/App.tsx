import React from 'react';

function App() {

  window.electron.onMessage((e, data) => {
    console.log(data)
  })

  return (
    <div className="App">
     <h1>Hello World</h1>
     <button onClick={() => {
        window.electron.sendMessage("coucou du renderer process")
     }}></button>
    </div>
  );
}

export default App;

import React from 'react';
import AlertQueue from './components/AlertQueue';
import Main from './pages/main';

interface AppProps {
  
}
 
interface AppState {
}
 
class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = { people: [], inputValue: "" };

    
  }

  render() { 
    return (
      <div className="App">
        <AlertQueue />
        <Main />
      </div>
    );
  }
}



export default App;

import React from 'react';
import AlertQueue from './components/Alerts/AlertQueue';
import CratesIOWindow from './components/Crates/CratesIOWindow';
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
        <CratesIOWindow />
      </div>
    );
  }
}



export default App;

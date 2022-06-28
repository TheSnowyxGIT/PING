import React from 'react';
import { Ide } from './classes/Ide';
import AlertQueue from './components/AlertQueue';
import CssTest from './pages/cssTests';



interface AppProps {
  
}
 
interface AppState {

}
 
class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = { };

    
  }
  
  render() { 
    return (
      <div className="App">
        <AlertQueue />
        <CssTest />
      </div>
    );
  }
}



export default App;

import React from 'react';
import AlertQueue from './components/AlertQueue';
import CssTest from './pages/cssTests';
import Main from './pages/main';


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
        <CssTest/>
      </div>
    );
  }
}



export default App;

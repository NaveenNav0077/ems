import React,{ useState } from 'react'
import './App.scss';
import Authendication from './Layouts/Authendication/Authendication'
import Dashboard from './Layouts/Dashboard/Dashboard'

function App() {
  const [state,setState] = useState({ auth:null, employees:null, selectd:null });

  const setStore = (data)=>{
    setState(data)
  }

  return (
    <div className="App">
      <Authendication setStore={setStore} state={state} />
      <Dashboard setStore={setStore} state={state} />
    </div>
  );
}

export default App;

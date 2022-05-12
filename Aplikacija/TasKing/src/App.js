import * as React from 'react';

import './styles/LoginForm.css';
import LoginForm from './components/LoginForm';

import './styles/CreateOrJoinForm.css';
import CreateOrJoinForm from './components/CreateOrJoinForm';
import MainScreen from './components/MainScreen';
import { Paper } from '@mui/material';

function App() {


  /* ovde treba da bude klasa korisnik da bi se isprobao login 

  const adminUser = {
    userName : "admin",
    password : "admin"
  }
  */


  return (
    <div className="App">
        <MainScreen name='Organizacije'/>
        <MainScreen name='Timovi'/>
        <Paper></Paper>
    </div>
  );
}

export default App;


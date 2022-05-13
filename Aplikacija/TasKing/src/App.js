import * as React from 'react';

import './styles/LoginForm.css';
import LoginForm from './components/LoginForm';

import './styles/CreateOrJoinForm.css';
import CreateOrJoinForm from './components/CreateOrJoinForm';
import MainScreen from './components/MainScreen';
import { Paper } from '@mui/material';
import ProfileForm from './components/ProfileForm';

import { BrowserRouter } from "react-router-dom";

function App() {


  /* ovde treba da bude klasa korisnik da bi se isprobao login 

  const adminUser = {
    userName : "admin",
    password : "admin"
  }
  */


  /*return (
    <div className="App">
        <MainScreen name='Organizacije'/>
        <MainScreen name='Timovi'/>
        <Paper></Paper>
    </div>
  );*/

  return (
    <div className="App">
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>  
    </div>
  );
}

export default App;


import * as React from 'react';

import './styles/LoginForm.css';
import LoginForm from './components/LoginForm';

import './styles/CreateOrJoinForm.css';
import CreateOrJoinForm from './components/CreateOrJoinForm';

import SignUpForm from './components/SignUpForm';
import './styles/SignUpForm.css';

import CreateOrganisationForm from './components/CreateOrganisationForm';
import './styles/CreateOrganisationForm.css';

import MainScreen from './components/MainScreen';
import { Paper } from '@mui/material';
import ProfileForm from './components/ProfileForm';

import { BrowserRouter ,Route ,Routes} from "react-router-dom";


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


      <Routes>

      <Route  path= "/" element={<LoginForm/>}/>
      <Route  path= "/CoJ" element={<CreateOrJoinForm/>}/>
      <Route  path= "/Main" element={<MainScreen/>}/>
      <Route  path= "/Profile" element={<ProfileForm />}/>
      <Route  path= "/SignUp" element={<SignUpForm />}/>
      <Route  path= "/cORG" element={<CreateOrganisationForm />}/>

      </Routes>
 

    </div>
  );
}

export default App;


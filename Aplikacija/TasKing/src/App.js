import * as React from 'react';

import './styles/Forms/LoginForm.css';
import LoginForm from './components/Forms/LoginForm';

import './styles/Forms/CreateOrJoinForm.css';
import CreateOrJoinForm from './components/Forms/CreateOrJoinForm';


import './styles/Forms/SignUpForm.css';
import SignUpForm from './components/Forms/SignUpForm';

import './styles/Forms/CreateOrganisationForm.css';
import CreateOrganisationForm from './components/Forms/CreateOrganisationForm';

import './styles/Forms/AccountCreated.css';
import AccountCreatedForm from './components/Forms/AccountCreatedForm';

import './styles/Forms/CreateTeamTasks.css';
import CreateTeamTasks from './components/Forms/CreateTeamTasks';

import MainScreen from './components/MainPage/MainScreen';
import './styles/MainPage/LeftMenu.css';
import './styles/MainPage/MainScreen.css';
import './styles/MainPage/ProjectDescription.css';
import './styles/MainPage/TaskList.css';
import './styles/MainPage/TeamsMenu.css';
import './styles/MainPage/UpProjectMenu.css';


import { Paper } from '@mui/material';
import Profile from './components/ProfileView/ProfileForm';
import './styles/ProfileView/MyAccountForm.css';
import './styles/ProfileView/ProfileForm.css';

import { BrowserRouter ,Route ,Routes} from "react-router-dom";

import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';


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
      <ReactNotifications />

      <Routes>

      <Route  path= "/" element={<LoginForm/>}/>
      <Route  path= "/CoJ" element={<CreateOrJoinForm/>}/>
      <Route  path= "/Main" element={<MainScreen/>}/>
      <Route  path= "/Profile/*" element={<Profile />}/>
      <Route  path= "/SignUp" element={<SignUpForm />}/>
      <Route  path= "/cORG" element={<CreateOrganisationForm />}/>
      <Route  path= "/acc" element={<AccountCreatedForm />}/>
      <Route  path= "/cTT" element={<CreateTeamTasks />}/>

      </Routes>
 

    </div>
  );
}

export default App;


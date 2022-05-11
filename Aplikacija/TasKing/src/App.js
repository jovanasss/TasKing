import * as React from 'react';

import './styles/LoginForm.css';
import LoginForm from './components/LoginForm';

function App() {


  /* ovde treba da bude klasa korisnik da bi se isprobao login 

  const adminUser = {
    userName : "admin",
    password : "admin"
  }
  */


  return (
    <div className="App">
        <LoginForm/>
    </div>
  );
}

export default App;


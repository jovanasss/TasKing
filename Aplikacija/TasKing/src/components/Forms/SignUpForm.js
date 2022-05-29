import React, { Component, useState }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import { ClassNames } from "@emotion/react";
import { Password } from "@mui/icons-material";
import Korisnik from "../../Classes/KorisnikDTO";

function SignUp(){


     
    // konstante  za cuvanje inputa 
    const [userName , setUserName] = useState('')
    const [userError , setUserError] = useState(false)
    const [passWord , setPassWord] = useState('')
    const [passError , setPassError] = useState(false)
    const [email , setEmail] = useState('')
    const [emailError , setEmailError] = useState(false)
    const [firstName , setFirstName] = useState('')
    const [fnameError , setFnameError] = useState(false)
    const [lastName , setLastName] = useState('')
    const [lnameError , setLnameError] = useState(false)
    const [phoneNo , setPhoneNo] = useState('')

    // nije potrebno polje tako da ne mora error handle
    const [phoneError , setPhoneError] = useState(false)


    async function signUP(){

        const user = {
            korisnickoIme: userName,
            lozinka: passWord,
            ime: firstName,
            prezime: lastName,
            email: email,
            brTelefona: phoneNo
       }
       console.log(JSON.stringify(user))
       try{
        let result = await fetch("https://localhost:5001/Korisnik/UnesiKorisnika/", {
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(user)
          });
          //result  = await result.json();
          console.log(result.status);
          if (result.status === 200){
            routeChange()
          }
          else{
              console.log(result.status)
          }
       }
       catch (error){
           console.log(error)

       }
}
    
    // error check => pravljenjeNaloga( podaci [] )
    const handleSignUp = () =>{

        if ( firstName === ''){
            setFnameError(true)
        }
        if (lastName === ''){
            setLnameError(true)
        }
        if (userName === ''){
            setUserError(true)
        }
        if (passWord === ''){
            setPassError(true)
        }
        if (email === ''){
            setEmailError(true)
        }
        // ako je sve ok pravi se nalog i prebacuje nas na main 
        if (firstName && lastName && userName && passWord  && emailCheck()){
            
            // pravljenjeNaloga( podaci[] )
            console.log(firstName , lastName , userName ,passWord , email, phoneNo)

            signUP()

        }
    }


    let navigate = useNavigate();
    // promena strane
    const routeChange = () =>{ 
      let path = `/acc`; 
      navigate(path);
    }

    // validacija emaila 
    const emailCheck = () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( re.test(email)){
            return true 
        }
        else {
            setEmailError(true);
            return false
        }
    }

    // kreiranje mui element teme 
    const theme = createTheme({
        components:{
          MuiTextField : {styleOverrides:{
              root : sx ({
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      //borderColor: "rgb(161, 17, 161)",
                      borderColor: "rgb(0, 100, 100)",
                    },
                ":hover"  :{
                    "& > fieldset": {
                        //borderColor: "rgb(161, 17, 161)",
                        borderColor: "rgb(0, 100, 100)",
                      },
                }  
                }
              })
          }}  
        },
        palette: {
          primary: {
            //main: "rgb(161, 17, 161)",
            main: "rgb(0, 100, 100)",
          },
          secondary:{
            main : pink[100],
          }
        },
      });


    
    return (
        <div className="divMain">
            <div className="divSignupNaslov">
                <label className="naslovSignup">Sign up to our website to access all options</label>
            </div>
            <form className="forma">
                <div className="GlavniDiv">
                    <div className="divNaslov"> 
                        <label className="naslov">SIGN UP</label>
                    </div>

                    <div className="inputFirstLastName">
                        <div className="inputFirstName">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setFirstName(e.target.value) } error={fnameError}
                                id="outlined-basic" label="First Name" variant="outlined" size="small" type="text" color="primary" required/>
                            </ThemeProvider>
                        </div>
                        <div className="inputLastName">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setLastName(e.target.value) } error={lnameError}
                                id="outlined-basic" label="Last Name" variant="outlined" size="small" type="text" color="primary" required/>
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className="inputUserSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setUserName(e.target.value) } error={userError}
                                id="outlined-basic" label="Username" variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputPassSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setPassWord(e.target.value) } error={passError}
                                id="outlined-basic" label="Password" variant="outlined" type="password" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputEmailSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setEmail(e.target.value) } error={emailError}
                                id="outlined-basic" label="Email" variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputPhoneSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setPhoneNo(e.target.value) } 
                                id="outlined-basic" label="Phone Number" variant="outlined" type="number" color="primary" sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <button onClick={(event) => { event.preventDefault() ; handleSignUp(); } } className="BtnSignUp">CREATE ACCOUNT</button>
                </div>
            </form>
        </div>
    )


}



export default SignUp ;
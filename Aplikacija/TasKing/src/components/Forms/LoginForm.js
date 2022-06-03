import React, { Component, useState , useEffect}   from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate} from "react-router-dom";
import Grid from '@mui/material/Grid';


function LoginForm()  {

    
    // konstante  za cuvanje inputa 
    const [userName , setUserName] = useState('')
    const [userError , setUserError] = useState(false)
    const [password , setPassWord] = useState('')
    const [passError , setPassError] = useState(false)

    const history = useNavigate();
    useEffect(() => {
      if(localStorage.getItem('user-info')){
        navigate("/Main")
      }
    },[])

    async function login(){
      const user = {
        korisnickoIme : userName,
        lozinka : password,
      };
      let result = await fetch("https://localhost:5001/Korisnik/UlogujKorisnika/", {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
        body : JSON.stringify(user)
      });
      console.log(JSON.stringify(user))
      let a = await result.json();
      console.log(a);
      console.log(JSON.stringify(a));
      console.log(result);
      localStorage.setItem('user-info',JSON.stringify(a))
      // history.push("/main")

      const userN = (JSON.parse(window.localStorage.getItem('user-info')));
      console.log(userN.id);

      let temp = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijeKorisnika/"+userN.id , {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      temp = await temp.json();
      let niz = [];
      console.log(temp);
      niz = temp ;
      let statusOrg = temp.status
      if (niz.length === 0){
        navigate("/CoJ")
      }
      else{
        routeChange()
      }

    }


    // error check => logovanje(user,pass)
    const handleLogin = () =>{

      // error ako je neki input prazan
      if ( userName === ''){
        setUserError(true)
      }
      if ( password === ''){
        setPassError(true)
      } // oba imaju vrednost => logovanje 
      if (userName && password){

        // logovanje(user , pass)
        console.log(userName ,password)
        login();
      }
    }

    // promena strane 
    let navigate = useNavigate();
    const routeChange = () =>{ 
      let path = `/Main`; 
      navigate(path);
    }

    // kreiranje teme u MUI ( bez toga nije htela da se promeni boja elementa)
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
        <div className="divLoginNaslov">
            <label className="loginNaslov">Welcome to TasKing web application</label>       
        </div>
        <Grid container>
        <Grid item md={4.5} xs={0} sm={2}>

        </Grid>
        <Grid item xs={12} sm={8} md={3} justifyContent={"center"} >
        <div>
        <form className="Forma">
            <label className="labelLogin">LOGIN</label>

            <div className="divUser">
            {/* element na koji hocemo da primenimo temu mora da se wrapuje */}
                    <ThemeProvider theme={theme} >
                    <TextField onChange={ (e) => setUserName(e.target.value) }
                    error={userError} id="outlined-basic" label="Username" variant="outlined" type="text" color="primary"/>
                    </ThemeProvider>
            </div>

            <div className="divPass">
                    <ThemeProvider theme={theme} >
                    <TextField onChange={ (e) => setPassWord(e.target.value) }
                    error={passError} id="outlined-basic" label="Password" variant="outlined" type="password" color="primary"/>
                    </ThemeProvider>
            </div>

            <div className="divCheck">
                    <FormControlLabel
                        label = "Remember me ?"
                        control = {
                            <Checkbox                    
                                sx={{
                                    //color: "rgb(161, 17, 161)",
                                    color: "rgb(0, 100, 100)",
                                    '&.Mui-checked': {
                                    //color: "rgb(161, 17, 161)",
                                    color: "rgb(0, 100, 100)",
                                    },
                                }}
                            />
                        }
                    />
            </div>

            <button className="BtnLogin" onClick={(event) => { event.preventDefault() ; handleLogin(); } }>LOGIN</button>

            <label className="OrSignUp">Need an account ? <a href ="http://localhost:3000/SignUp" >SignUp</a></label>   
        </form>
        </div>
        </Grid>
        <Grid item md={4.5} xs={0} sm={2}>

        </Grid>
        </Grid>
    </div>
)
}

export default LoginForm ;
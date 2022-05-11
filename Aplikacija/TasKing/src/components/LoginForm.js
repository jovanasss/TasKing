import React, { Component }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"


function LoginForm()  {

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

        <form className="Forma">
            <label className="labelLogin">LOGIN</label>

            <div className="divUser">
            {/* element na koji hocemo da primenimo temu mora da se wrapuje */}
                    <ThemeProvider theme={theme} >
                    <TextField id="outlined-basic" label="Username" variant="outlined" type="text" color="primary"/>
                    </ThemeProvider>
            </div>

            <div className="divPass">
                    <ThemeProvider theme={theme} >
                    <TextField id="outlined-basic" label="Password" variant="outlined" type="password" color="primary"/>
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

            <button className="BtnLogin">LOGIN</button>

            <label className="OrSignUp">Need an account ? <a href ="google.rs" >SignUp</a></label>   
        </form>
    </div>
)
}

export default LoginForm ;
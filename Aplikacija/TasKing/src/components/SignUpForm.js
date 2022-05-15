import React, { Component }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import { ClassNames } from "@emotion/react";

function SignUp(){

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
            <form className="forma">
                <div className="GlavniDiv">
                    <div className="divNaslov"> 
                        <label className="naslov">SIGN UP</label>
                    </div>

                    <div className="inputFirstLastName">
                        <div className="inputFirstName">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="First Name" variant="outlined" size="small" type="text" color="primary" required/>
                            </ThemeProvider>
                        </div>
                        <div className="inputLastName">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="Last Name" variant="outlined" size="small" type="text" color="primary" required/>
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className="inputUserSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="Username" variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputPassSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="Password" variant="outlined" type="password" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputEmailSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="Email" variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <div className="inputPhoneSignUp">
                            <ThemeProvider theme={theme}>
                                <TextField id="outlined-basic" label="Phone Number" variant="outlined" type="number" color="primary" sx ={{ width: "85%"  }}/> 
                            </ThemeProvider>
                    </div>
                    <button className="BtnSignUp">CREATE ACCOUNT</button>
                </div>
            </form>
        </div>
    )


}



export default SignUp ;
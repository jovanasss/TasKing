import React, { Component }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";


function CreateOrganisationForm (){

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
        <div className="divMainCORG">
        <form className="formaCORG">
            <div className="GlavniDivCORG">
                <div className="divNaslovCORG"> 
                    <label className="naslovCORG">CHOSE A NAME FOR YOUR ORGANISATION</label>
                </div>

                    <div className="inputORGname">
                        <ThemeProvider theme={theme}>
                            <TextField id="outlined-basic" label="Name" variant="outlined" size="small" type="text" color="primary" required/>
                        </ThemeProvider>
                    </div>

                   
                <button className="BtnCORG">CREATE ORGANISATION</button>
            </div>
        </form>
    </div>
    )
}



export default CreateOrganisationForm ;
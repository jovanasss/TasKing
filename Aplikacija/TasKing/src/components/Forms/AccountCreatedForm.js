import React, { Component }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange ,green } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Grid from '@mui/material/Grid';


function AccountCreatedForm()  {


  // promena stranice
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/CoJ`; 
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
        <Grid container>
        <Grid item  xs={0} sm={2} md={4}>
        </Grid>
        <Grid item xs={12} sm={8} md={4}>
        <form className="FormaAcc">
            < CheckCircleOutlineIcon style={{ 
                color: green[500] , 
                marginLeft:'35%' , 
                marginRight:'35%',
                marginTop : '0%',
                marginBottom : '10%',
                width : '30%',
                fontSize : 160,
                }  } />
            <label className="labelLoginAcc">Account created successfully </label>

            <button className="BtnAcc" onClick={routeChange}>Procced</button>
           
        </form>
        </Grid>
        <Grid item  xs={0} sm={2} md={4}>
        </Grid>
        </Grid>
    </div>
)
}

export default AccountCreatedForm ;
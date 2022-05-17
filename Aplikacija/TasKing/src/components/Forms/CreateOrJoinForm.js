import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';

function CreateOrJoinForm(){

  const theme = createTheme({
    components: {
        MuiButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(31, 206, 206);",
          },
         }
        }}
       },
    palette: {
      primary: {
        main: "rgb(0, 100, 100)",
      },
      secondary:{
        main : "rgb(0, 200, 0)",
      }
    },
  });

  
      let navigate = useNavigate(); 
      const routeChange = () =>{ 
        let path = `/cORG`; 
        navigate(path);
      }

  return(
    <div className="Main">
       <form className="Form">
       
        <div className="JoinDiv">
          <div className="JoinOrganization">
          <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
            <label className="label">Join a organization with a code</label>
            <input type="text" placeholder="Enter code" name="inputCode1" onKeyUp={EnableDisable} />
            <button className="buttonJoin1">Join</button>
          </div>
          <div className="JoinTeam">
            <div className="divIcons"><div  className="divIcon"><GroupIcon /></div></div>
            <label className="label">Join a team with a code</label>
            <input type="text" placeholder="Enter code" name="inputCode2" onKeyUp={EnableDisable} />
            <button className="buttonJoin2">Join</button>
          </div>
        </div>
      <ThemeProvider theme={theme}>
        <Button 
        onClick={routeChange}
        //style={createOrgButtonStyle} 
        sx={{
           border: 2,
           borderColor:"text.primary",
           display: "flex",
           flexDdirection: "column",
           width: "50%",
           height: "70px",
           justifyContent: "center",
           alignItems: "center",
           fontSize: "16px",
           fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
           /*background-color: rgb(161, 17, 161);*/
           backgroundColor: "rgb(0, 100, 100)",
           color: "aliceblue",
           boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2) 0 6px 20px 0 rgba(0,0,0,0.19)",
           marginLeft: "10%",
           marginRight: "10%", 
           marginBottom: "10px",
           marginTop: "50px",
           borderRadius: "25px",

          }}
        startIcon={<AddCircleIcon />}>
        create organization
        </Button>
      </ThemeProvider>
      </form>
    </div>
  )
}

const EnableDisable = (input) =>{
  if(input.name === "inputCode1"){
    let btnJoin = document.getElementsByClassName("buttonJoin1");
    if (input.value.trim() != "") {
      btnJoin.disabled = false;
    } else {
      btnJoin.disabled = true;
    }
  }
  else{
    let btnJoin = document.getElementsByClassName("buttonJoin2");
    if (input.value.trim() != "") {
      btnJoin.disabled = false;
    } else {
      btnJoin.disabled = true;
    }
  }
}

const createOrgButtonStyle = {
  display: "flex",
  flexDdirection: "column",
  width: "50%",
  height: "70px",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "16px",
  fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
  /*background-color: rgb(161, 17, 161);*/
  backgroundColor: "rgb(0, 100, 100)",
  color: "aliceblue",
  boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2) 0 6px 20px 0 rgba(0,0,0,0.19)",
  marginLeft: "10%",
  marginRight: "10%", 
  marginBottom: "10px",
  marginTop: "50px",
  borderRadius: "25px",
}


export default CreateOrJoinForm ;
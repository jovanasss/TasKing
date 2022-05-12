import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/CreateOrJoinForm.css';

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';

function CreateOrJoinForm(){

  return(
    <div className="Main">
       <form className="Form">
       
       <div className="JoinDiv">
         <div className="JoinOrganization">
         <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
           <label>Join a organization with a code</label>
           <input type="text" placeholder="Enter code" name="inputCode1" onKeyUp={EnableDisable} />
           <button className="buttonJoin1">Join</button>
         </div>
         <div className="JoinTeam">
           <div className="divIcons"><div  className="divIcon"><GroupIcon /></div></div>
           <label>Join a team with a code</label>
           <input type="text" placeholder="Enter code" name="inputCode2" onKeyUp={EnableDisable} />
           <button className="buttonJoin2">Join</button>
         </div>
       </div>
    
       <Button 
       style={createOrgButtonStyle} 
       sx={{border: 2, borderColor:"text.primary"}}
       startIcon={<AddCircleIcon />}>
       create organization
       </Button>
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
import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import {ThemeProvider} from "@mui/system";
import { FormControlLabel, TextField } from "@mui/material";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';
import Grid from '@mui/material/Grid';

function CreateOrJoinForm(){


  // kreiranje MUI teme
  const theme = createTheme({
    components: {
        MuiButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(31, 206, 206);",
          },
         }
        }},
        MuiInput: {styleOverrides:{
          input: {
            "&::placeholder": {
              color: "gray"
            },
            color: "white", // if you also want to change the color of the input, this is the prop you'd use
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

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  document.body.style.backgroundColor = darkMode ? "rgb(26, 25, 25)" :"azure";

  //Cuvanje inputa
  const [teamCode , setTeamCode] = useState('')
  const [teamCodeError , setTeamCodeError] = useState(false)
  const [orgCode , setOrgCode] = useState('')
  const [orgCodeError , setOrgCodeError] = useState(false)

  // Join Team
  async function  handleJoinTeam()  {
    
    if (teamCode === ''){
      setTeamCodeError(true)
      setOrgCodeError(false)
    }
    else {
      setOrgCode("")
      // joinTeam(userID ,orgID)
      //console.log(teamCode)

      let temp = await fetch("https://localhost:5001/Tim/VratiTim/"+teamCode , {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      let statusTima = temp.status;
      temp = await temp.json();
      //console.log(temp);
      let idNovogTima = temp;
      //console.log(statusTima);

      if (temp != 0){


        let nzm = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijuTim/" +idNovogTima , {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        });
        nzm = await nzm.json();
        let idORG = nzm ;


        const token = (JSON.parse(window.localStorage.getItem('user-info')));
        let userID = await fetch("https://localhost:5001/Korisnik/VratiIDKorisnika/"+token.value , {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        })
        userID = await userID.json();
        //console.log(userN.id);

        const ClanOrganizacije = {
          idKorisnika : userID[0].id,
          idOrganizacije : idORG,
          admin : false
        }

        let rezultat = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
          body : JSON.stringify(ClanOrganizacije)
        });
        let statusU = rezultat.status ;
        rezultat = await rezultat.json();
        let idClanaORG = rezultat ;
        //console.log("IDclanaOrganizacije :" ,idClanaORG);
        //console.log(statusU);


        if (statusU === 200){


          const ClanTima = {
            idClanaOrganizacije : idClanaORG,
            idtima : idNovogTima,
            vodja : false
          }
          //console.log(ClanTima);
  
  
          let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/",{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanTima)
          });
  
          let statusTmp = tmp.status;
          if ( statusTmp === 200){

            routeChange();

          }
        }
      }
      else {
        alert("Netacan kod !")
        setOrgCodeError(false)
        setTeamCodeError(true)
        setTeamCode("");
      }

       // routeChange()
    }

  }

  // Join Org
  async function handleJoinOrg()  {

    if (orgCode === ''){
      setOrgCodeError(true)
      setTeamCodeError(false)
      setTeamCode("");
    }
    else {
      // joinOrg(userID ,orgID)
      //console.log(orgCode)

      let temp = await fetch("https://localhost:5001/Organizacija/VratiOrganizaciju/"+orgCode , {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      temp = await temp.json();
      //console.log(temp);
      let idNoveOrg = temp;
      if (temp != 0){
        const token = (JSON.parse(window.localStorage.getItem('user-info')));
        let userID = await fetch("https://localhost:5001/Korisnik/VratiIDKorisnika/"+token.value , {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        })
        userID = await userID.json();
        //console.log(userN.id);
  
        const ClanOrganizacije = {
          idKorisnika : userID[0].id,
          idOrganizacije : idNoveOrg,
          admin : false,
        }
  
          let tmp = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanOrganizacije)
          });
          let noviStatus = tmp.status;
          if ( noviStatus === 200){
            routeChange();
          }
  
  
        // routeChange()
      }
      else {
        alert("Netacan kod !")
        setOrgCodeError(true);
        setTeamCodeError(false);
        setTeamCode("");
      }
      }


  }

  // promena strane 
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
  let path = `/main`; 
  navigate(path);
  }
  const navigacija = () => {
    let path = '/cORG';
    navigate(path);
  }



  return(
    <div className={darkMode ? "MainDM" :"Main"}>
      <Grid container>
       <Grid item  xs={0} sm={2} md={3.5}>
       </Grid>
       <Grid item xs={12} sm={8} md={5}>
       <form className={darkMode ? "FormDM":"Form"}>
       
        <div className="JoinDiv">
          <div className={darkMode ? "JoinOrganizationDM" :"JoinOrganization"}>
          <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
            <label className={darkMode ? "labelDM":"label"}>Join a organization with a code</label>
            <ThemeProvider theme={theme}>
                <TextField onChange={ (e) => setOrgCode(e.target.value) } error={orgCodeError}
                value = {orgCode}
                sx={{ width : "50%" , marginLeft : "25%" , marginRight : "25%" , marginTop : "5%"}}
                id="outlined-basic1" label="Enter Code" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" size="small" type="text" color="primary" required/>
            </ThemeProvider>
            <button className={darkMode ? "buttonJoin1DM":"buttonJoin1"} onClick={(event) => { event.preventDefault() ; handleJoinOrg(); } }>Join</button>
          </div>
          <div className={darkMode ? "JoinTeamDM" : "JoinTeam"}>
            <div className="divIcons"><div  className="divIcon"><GroupIcon /></div></div>
            <label className={darkMode ? "labelDM":"label"}>Join a team with a code</label>
            <ThemeProvider theme={theme}>
                <TextField onChange={ (e) => setTeamCode(e.target.value) } error={teamCodeError}
                value = {teamCode}
                sx={{ width : "50%" , marginLeft : "25%" , marginRight : "25%" , marginTop : "5%"}}
                id="outlined-basic2" label="Enter Code" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" size="small" type="text" color="primary" required/>
            </ThemeProvider>
            <button className={darkMode ? "buttonJoin2DM":"buttonJoin2"} onClick={(event) => { event.preventDefault() ; handleJoinTeam(); } }>Join</button>
          </div>
        </div>
      <ThemeProvider theme={theme}>
        <Button 
        onClick={navigacija}
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
      </Grid>
      <Grid item  xs={0} sm={2} md={3.5}>
      </Grid>
      </Grid>
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
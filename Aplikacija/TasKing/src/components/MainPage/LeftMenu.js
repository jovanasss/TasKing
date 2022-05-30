import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/LeftMenu.css';
import { createTheme, IconButton, List, ListItem, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TeamsMenu from './TeamsMenu';
const drawerWidth = 240     


export default function LeftMenu(props){

  const [organisations, setOrganisations] = useState([])
  const showOrganisations = ()=>{
    fetch("https://localhost:5001/Korisnik/VratiClanoveOrganizacije/" + "jzlnikola" + "/" + "123nikola",
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        console.log(res);
        res.json().then(data => {
          console.log(data);
          setOrganisations(data)
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
  }

  useEffect(() => {
    showOrganisations();
  }, []);

  const theme = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(255, 255, 255)",
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

  
  const [curOrg, setOrg] = useState(-1)
    
  return(
    <div style={{display: 'flex', position: 'fixed', zIndex: '1', top: '0', left: '0', overflowX: 'hidden'}}>
    <div className='leftMenu'>
    <Paper className='leftList'>
        <List className='listDiv'>
          <ListItem key={0}>
              <ThemeProvider theme={theme}>
                <IconButton sx={{backgroundColor: 'white'}}>
                  <AddCircleIcon/>
                </IconButton>
              </ThemeProvider>
            </ListItem>
           {organisations.map(item => (
             <ListItem key={item.idClan} className={curOrg==item.idClan? 'activeEnt' : null}>
              <ThemeProvider theme={theme}>
                <IconButton onClick={() =>{setOrg(item.idClan)}} sx={{backgroundColor: 'white'}}>
                  <SubjectOutlined/>
                </IconButton>
              </ThemeProvider>
             </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    <TeamsMenu clanID={curOrg}/>
    </div>
  )
}
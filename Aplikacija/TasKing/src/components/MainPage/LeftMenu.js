import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/LeftMenu.css';
import { useNavigate } from "react-router-dom";
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
    
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    console.log(user.id);


    fetch("https://localhost:5001/Korisnik/VratiClanoveOrganizacije/" + user.id,
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
          if(data==undefined || data==null)
          return;
         
          if(data.length==0)
            return;  
          console.log(data[0].idClan);
          setOrg(data[0].idClan)
          localStorage.setItem('clanOrgID',data[0].idClan)
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
  }


  let navigate = useNavigate();
  // promena strane
  const routeChange = () =>{ 
    let path = `/cORG`; 
    navigate(path);
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
                <IconButton sx={{backgroundColor: 'white'}} onClick={() => routeChange()}>
                  <AddCircleIcon/>
                </IconButton>
              </ThemeProvider>
            </ListItem>
           {organisations.map(item => (
             <ListItem key={item.idClan} className={curOrg==item.idClan? 'activeEnt' : null}>
              <ThemeProvider theme={theme}>
                <Tooltip title={item.imeOrganizacije}>
                  <IconButton onClick={() =>{setOrg(item.idClan); localStorage.setItem('clanOrgID',item.idClan)}} sx={{backgroundColor: 'white'}}>
                      <SubjectOutlined/>
                  </IconButton>
                </Tooltip>   
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
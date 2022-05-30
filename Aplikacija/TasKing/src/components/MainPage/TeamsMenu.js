import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/TeamsMenu.css';
import { Avatar, Button, createTheme, Icon, IconButton, List, ListItem, ListItemIcon, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { Autorenew, SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import ProjectMenu from './ProjectMenu';
const drawerWidth = 240

export default function TeamsMenu(props){

  const [teams, setTeams] = useState([])
  const showTeams = ()=>{
    fetch("https://localhost:5001/Organizacija/VratiClanoveTima/" + props.clanID,
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
          setTeams(data)
        });
      }
      else
      {
        alert("");
      }
    })
  }

  useEffect(() => {
    if(props.clanID!=-1)
    {
      console.log('✅ variable is NOT undefined or null');
      showTeams();
    }
  }, [props.clanID]);


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

  
  const [curTim, setTim] = useState(-1)
    
  return(
    <div style={{display:'flex'}}>
      <div className='teamMenu'>
          <Paper className='teamList'>
              <List>
              <ListItem key={0} style={{display: props.clanID!=-1? 'inline' : 'none'}}>
                  <ThemeProvider theme={theme}>
                    <Button>
                      <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                        <AddCircleIcon/>
                      </IconButton>
                      <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                          Add Team
                      </Typography>
                    </Button>
                  </ThemeProvider>
              </ListItem>
              {teams.map(team => (
                  <ListItem key={team.idTima} className={curTim==team.idTima? 'activeEnt' : null}>
                    <ThemeProvider theme={theme}>
                      <Button onClick={() =>{setTim(team.idTima)}}>
                        <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                          <SubjectOutlined/>
                        </IconButton>
                        <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
                      </Button>
                    </ThemeProvider>
                  </ListItem>
              ))}
              </List>
          </Paper>
      </div>
      <ProjectMenu vodjaStatus={1} timID = {curTim}/>
    </div>
  )
}
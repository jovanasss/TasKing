import React, { Component, useState } from 'react';
//import '../styles/MainPage/TeamsMenu.css';
import { Avatar, Button, createTheme, Icon, IconButton, List, ListItem, ListItemIcon, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import { ThemeProvider } from '@emotion/react';
const drawerWidth = 240

  const teams = [
      {
        id : 0,
        name: 'Marketing tim',
        picture: <SubjectOutlined/>
      },
      {
        id : 1,
        name: 'Drustvene mreze',
        picture: <SubjectOutlined/>
      },
      {
        id : 2,
        name: 'Tasking tim',
        picture: <SubjectOutlined/>
      },
      {
        id : 3,
        name: 'Multiplayer igrice tim',
        picture: <SubjectOutlined/>
      },
      {
        id : 4,
        name: 'Pravljenje aplikacija za knjigovodjstvo',
        picture: <SubjectOutlined/>
      }
  ]

export default function TeamsMenu(props){

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

  
  const [curOrg, setOrg] = useState(0)
    
  return(
    <div className='teamMenu'>
        <Paper className='teamList'>
            <List>
            {teams.map(team => (
                <ListItem key={team.id} className={curOrg==team.id? 'active' : null}>
                <ThemeProvider theme={theme}>
                        <Button onClick={() =>{setOrg(team.id)}}>
                            <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                            {team.picture}
                            </IconButton>
                            <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                                {team.name.slice(0,30) + (team.name.length>30? "..." : "")}
                            </Typography>
                        </Button>
                    </ThemeProvider>
                </ListItem>
            ))}
            </List>
        </Paper>
    </div>
  )

    // return(
    //     <div className='leftMenu'>
    //     <Paper className='leftList'>
    //         <List className='listDiv'>
    //         {teams.map(item => (
    //             <ListItem key={item.id} className={curOrg==item.id? 'active' : null}>
    //             <Tooltip title={item.name}>
    //                 <ThemeProvider theme={theme}>
    //                     <IconButton onClick={() =>{setOrg(item.id)}} sx={{backgroundColor: 'white'}}>
    //                     {item.picture}
    //                     </IconButton>
    //                 </ThemeProvider>
    //             </Tooltip>
    //             </ListItem>
    //         ))}
    //         </List>
    //     </Paper>
    //     </div>
    // )
}
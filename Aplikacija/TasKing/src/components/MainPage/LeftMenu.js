import React, { Component, useState } from 'react';
//import '../styles/MainPage/LeftMenu.css';
import { createTheme, IconButton, List, ListItem, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import { ThemeProvider } from '@emotion/react';
const drawerWidth = 240

  const organisationItems = [
      {
        id : 0,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 1,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 2,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 3,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 4,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 5,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 6,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 7,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 8,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 9,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 10,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 11,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 12,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 13,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 14,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 15,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 16,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 17,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 18,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 19,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 20,
        name: 'Poso',
        picture: <SubjectOutlined/>
      },
      {
        id : 21,
        name: 'Faks',
        picture: <SubjectOutlined/>
      },
      {
        id : 22,
        name: 'Skola',
        picture: <SubjectOutlined/>
      },
      {
        id : 23,
        name: 'Poso',
        picture: <SubjectOutlined/>
      }
  ]

export default function LeftMenu(props){

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
    <div className='leftMenu'>
    <Paper className='leftList'>
        <List className='listDiv'>
           {organisationItems.map(item => (
             <ListItem key={item.id} className={curOrg==item.id? 'activeEnt' : null}>
               <Tooltip title={item.name}>
                <ThemeProvider theme={theme}>
                    <IconButton onClick={() =>{setOrg(item.id)}} sx={{backgroundColor: 'white'}}>
                      {item.picture}
                    </IconButton>
                </ThemeProvider>
             </Tooltip>
             </ListItem>
           ))}
        </List>
      </Paper>
    </div>
  )
}
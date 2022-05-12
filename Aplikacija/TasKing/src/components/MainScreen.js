import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/MainScreen.css';

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';
import { Drawer, Icon, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, makeStyles, Paper, scrollView } from '@mui/material';
import { Typography } from '@mui/material';
import { ClassNames } from '@emotion/react';
import { SubjectOutlined } from '@mui/icons-material';
const drawerWidth = 240

/*
const useStyles = makeStyles({
    drawer: {
      width: drawerWidth,
      ".MuiDrawer-paper": {
        width: drawerWidth,
      },
    },
  })*/

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



function MainScreen(props){
    //const classes = useStyles()
    //<ListItemText primary={item.name}/>
    const [curOrg, setOrg] = useState(0)
    
  return(
    <div className='specialDiv'>
        <div>
            <Typography variant="h5"> {props.name}</Typography>
        </div>

    <Paper style={{maxHeight: 900, overflow: 'auto'}}>
        <List className='listDiv'>
           {organisationItems.map(item => (
               <ListItem key={item.id} button onClick={() =>{setOrg(item.id)}} className={curOrg==item.id? 'active' : null}>
                   <ListItemAvatar>{item.picture}</ListItemAvatar>
                   <ListItemText primary={item.name}/>
               </ListItem>
           ))}
        </List>
      </Paper>
    </div>
  )
}

export default MainScreen;
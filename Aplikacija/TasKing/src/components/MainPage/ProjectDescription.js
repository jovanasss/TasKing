import * as React from 'react';
//import '../styles/MainPage/ProjectDescription.css';
import { AppBar, Toolbar, Typography } from '@mui/material';


export default function ProjectDescription(props) {

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  

  return (
    <div className={darkMode ? "descriptionDivDM" :'descriptionDiv'}>
        <h2>{props.ProjectName}</h2>
        <Typography>
          {props.ProjectDescription}
        </Typography>
    </div>
  );
}
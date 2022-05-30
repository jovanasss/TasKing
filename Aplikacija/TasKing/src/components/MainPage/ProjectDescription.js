import * as React from 'react';
//import '../styles/MainPage/ProjectDescription.css';
import { AppBar, Toolbar, Typography } from '@mui/material';


export default function ProjectDescription(props) {
  return (
    <div className='descriptionDiv'>
        <h2>{props.ProjectName}</h2>
        <Typography>
          {props.ProjectDescription}
        </Typography>
    </div>
  );
}
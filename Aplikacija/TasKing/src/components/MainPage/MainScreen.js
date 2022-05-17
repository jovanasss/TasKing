import * as React from 'react';
//import '../styles/MainPage/MainScreen.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import ProjectDescription from './ProjectDescription';
import TaskList from './TaskList';
import UpProjectMenu from './UpProjectMenu';
import TeamsMenu from './TeamsMenu';


function MainScreen()  {
    const navigate=useNavigate();
      return (
        <div className="App">
            <LeftMenu/>
            <TeamsMenu name='Timovi'/>
            <div>
              <UpProjectMenu/>
              <ProjectDescription/>
            </div>
        </div>
      );
}

export default MainScreen ;

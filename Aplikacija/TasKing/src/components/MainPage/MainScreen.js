import * as React from 'react';
//import '../styles/MainPage/MainScreen.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import ProjectDescription from './ProjectDescription';
import TaskList from './TaskList';
import UpProjectMenu from './UpProjectMenu';
import TeamsMenu from './TeamsMenu';
import ProgressBar from './ProgressBar';
import ProjectMenu from './ProjectMenu';


function MainScreen()  {
    const navigate=useNavigate();
      return (
        <div className="App">

          <div style={{display: 'flex', position: 'fixed', zIndex: '1', top: '0', left: '0', overflowX: 'hidden'}}>
            <LeftMenu/>
            <TeamsMenu name='Timovi'/>
          </div>
            <div style={{marginLeft: '14.62vw'}}>
              <ProjectMenu vodjaStatus={1}/>
            </div>
        </div>
      );
}

export default MainScreen ;

import * as React from 'react';
import '../styles/MainScreen.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import ProjectDescription from './ProjectDescription';
import TaskList from './TaskList';
import UpProjectMenu from './UpProjectMenu';


function MainScreen()  {
    const navigate=useNavigate();
      return (
        <div className="App">
            <LeftMenu name='Organizacije'/>
            <LeftMenu name='Timovi'/>
            <div>
              <UpProjectMenu/>
              <TaskList/>
              <ProjectDescription/>
            </div>
        </div>
      );
}

export default MainScreen ;

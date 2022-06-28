import * as React from 'react';
//import '../styles/MainPage/UpProjectMenu.css';
import { AppBar, IconButton, Toolbar, Typography, createTheme, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { ArrowDropDown, Autorenew, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import ProgressBar from './ProgressBar';
import ProjectDescription from './ProjectDescription';

const options = [
  'All tasks',
  'Available tasks',
  'The tasks Im working on',
  'The tasks wainting for review',
  'Returned tasks',
];


const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
const boje = ['rgb(255, 255, 255)', 'rgb(219, 219, 219)', 'rgb(77, 154, 255)', 'rgb(255, 207, 49)', 'rgb(255, 87, 69)']

export default function UpProjectMenu(props) {
  let navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    localStorage.setItem('selectedStatus', index)
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [project, setProject] = React.useState({})
  const [procenat, setProcenat] = React.useState(0)
  const showProjectData = ()=>{
    const proje = window.localStorage.getItem('projID');
    //console.log(proje);

    if(props.projectID==-1)
    {
      setProject({})
      setProcenat(0)
      return;
    }

    fetch("https://localhost:5001/Tim/VratiProjekat/" + props.projectID + "/" + props.clanTimaID,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        //console.log(res);
        res.json().then(data => {
          //console.log(data);
          //setProject(data)
          setProject(data.projekatInfo)
          setProcenat(data.procenat.toFixed(0))
        });
      }
      else
      {
        alert("");
      }
    })
  }

  React.useEffect(() => {
    showProjectData();
    if(window.localStorage.getItem('selectedStatus')===null)
    {
      localStorage.setItem('selectedStatus', 0)
      setSelectedIndex(0);
    }
    else
    {
      setSelectedIndex(window.localStorage.getItem('selectedStatus'));
    }
  }, [props.projectID]);


  const theme = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(255, 255, 255)",
          },
          backgroundColor: "rgb(255, 255, 255)",
          float: 'right'
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
  
  return (
    <div>
        <AppBar position="static" className='upMenu' style={{ background: "rgb(17, 156, 151)" }}>
          <Toolbar className='upToolbar'>
            <Typography variant="h6" color="inherit" component="div">
              Tasks
            </Typography>
              <div>
                <List
                  component="nav"
                  aria-label="Device settings"
                  sx={{ bgcolor: 'background.paper', marginLeft: '30px' }}
                >
                  <ListItem
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                  >
                    <ListItemText
                      secondary={options[selectedIndex]}
                    />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                  }}
                >
                  {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        sx={{backgroundColor:boje[index]}}>
                        {option}
                      </MenuItem>
                    ))}
                </Menu>
              </div>
          </Toolbar>
        </AppBar>
        <TaskList selected={selectedIndex!=4? selectedIndex : 5} vodjaStatus={1} taskovi = {project.taskovi} projectID={props.projectID}/>
        <ProgressBar procenat = {procenat} imaTaskova={project!=undefined && project!=null && project.taskovi!=undefined && project.taskovi!=null && project.taskovi.lenght!=0}/>
        <TaskList selected={4} vodjaStatus={0} taskovi = {project.taskovi} />
        <ProjectDescription ProjectName={project.imeProj} ProjectDescription={project.opisProj} ProjectID={props.projectID} Project={project}/>
    </div>
  );
}
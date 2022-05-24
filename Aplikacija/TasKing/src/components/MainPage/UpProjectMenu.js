import * as React from 'react';
//import '../styles/MainPage/UpProjectMenu.css';
import { AppBar, IconButton, Toolbar, Typography, createTheme, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { ArrowDropDown, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import ProgressBar from './ProgressBar';
import ProjectDescription from './ProjectDescription';

const options = [
  'All tasks',
  'Available tasks',
  'The tasks im intrested in',
  'The tasks Im working on',
  'The tasks wainting for review',
];

const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
const boje = ['rgb(255, 255, 255)', 'rgb(255, 207, 49)', 'rgb(77, 154, 255)', 'rgb(78, 255, 93)']

export default function UpProjectMenu(props) {
  let navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
                      sx={{backgroundColor:boje[index-1] }}>
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
          </Toolbar>
        </AppBar>
        <TaskList selected={selectedIndex} vodjaStatus={props.vodjaStatus}/>
        <ProgressBar vodjaStatus={props.vodjaStatus}/>
        <TaskList selected={5} vodjaStatus={0}/>
        <ProjectDescription/>
    </div>
  );
}
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UpProjectMenu from './UpProjectMenu';
import { ThemeProvider } from '@emotion/react';
import { Button, IconButton } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import { createTheme } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const projects = [
    {
        id:0,
        naziv:"Swe projekat",
    },
    {
        id:1,
        naziv:"projekat iz rm",
    },
    {
        id:2,
        naziv:"projekat neki treci",
    }
]

export default function ProjectMenu(props) {
  const [value, setValue] = React.useState(0);
  const [curProj, setProj] = React.useState(0)
  const boje = ['rgb(147, 219, 217)', 'rgb(17, 156, 151)']
  const displej = ['none', 'inline']

  let navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = createTheme({
    components: {
        MuiButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(0, 117, 83)",
          },
         }
        }},
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', background: "rgb(147, 219, 217)", display:'flex' }}>
          {projects.map(proj =>
          <Button  onClick={() =>{setProj(proj.id)}} sx={{backgroundColor: curProj==proj.id? boje[1] : boje[0], color: 'black'}}>   
          {proj.naziv}
          </Button>
            )}
          <IconButton sx={{marginLeft:"0.5%", display: displej[props.vodjaStatus] }}>
            <AddIcon sx={{marginLeft:"0.5%", width: '25px', height: '25px' }}/>
          </IconButton>
            <div sx={{float: 'right'}}>
            <IconButton onClick={() => navigate('/Profile')} sx={{marginLeft:"0.5%"}}>
            <AccountCircleIcon sx={{marginLeft:"0.5%", width: '50px', height: '50px' }}/>
            </IconButton>
            </div>

      </Box>
      <UpProjectMenu vodjaStatus={props.vodjaStatus}/>
    </div>
  );
}

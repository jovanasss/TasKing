import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UpProjectMenu from './UpProjectMenu';
import { ThemeProvider } from '@emotion/react';
import { Button, IconButton } from '@mui/material';
import { Autorenew, SubjectOutlined } from '@mui/icons-material';
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


export default function ProjectMenu(props) {
  const [value, setValue] = React.useState(0);
  const [curProj, setProj] = React.useState(-1)
  const boje = ['rgb(147, 219, 217)', 'rgb(17, 156, 151)']
  const displej = ['none', 'inline']

  const [projects, setProjects] = React.useState([])
  const showProjects = ()=>{
    fetch("https://localhost:5001/Tim/VratiProjekteTima/" + 1,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        console.log(res);
        res.json().then(data => {
          console.log(data);
          setProjects(data)
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
  }

  React.useEffect(() => {
    if(props.timID!=-1)
    {
      console.log('✅ variable is NOT undefined or null');
      showProjects();
    }
  }, [props.timID]);

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
          <Button  onClick={() =>{setProj(proj.idProj)}} sx={{backgroundColor: curProj==proj.idProj? boje[1] : boje[0], color: 'black'}}>   
          {proj.imeProj}
          </Button>
            )}
          <IconButton sx={{marginLeft:"0.5%", display: (props.timID!=-1 && props.vodjaStatus)? 'inline' : 'none'}}>
            <AddIcon sx={{marginLeft:"0.5%", width: '25px', height: '25px' }}/>
          </IconButton>
            <div sx={{float: 'right'}}>
            <IconButton onClick={() => navigate('/Profile')} sx={{marginLeft:"0.5%"}}>
              <AccountCircleIcon sx={{marginLeft:"0.5%", width: '50px', height: '50px' }}/>
            </IconButton>
            </div>

      </Box>
      <UpProjectMenu vodjaStatus={props.vodjaStatus} projectID={curProj}/>
    </div>
  );
}

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UpProjectMenu from './UpProjectMenu';
import Slider from '@mui/material/Slider';
import { Button, IconButton } from '@mui/material';
import { Autorenew, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FormControlLabel, TextField , Dialog, DialogTitle , DialogContent ,DialogContentText,DialogActions } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { ThemeProvider,createTheme } from '@mui/material/styles';

function SimpleDialog(props) {
  const theme = createTheme({
    components: {
        MuiButton: {styleOverrides:{
         root: {
          backgroundColor: "rgb(0, 117, 83)",
          color: "rgb(255, 255, 255)",
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

  let navigate = useNavigate();
  // promena strane
  const visitProfile = (korisnikID) =>{ 
    let path = `/Profile`; 
    localStorage.setItem('ProfileUser-info', korisnikID)
    navigate(path);
  }

  const { onClose, selectedValue, open } = props;
  const [members, setMembers] = React.useState([])

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleRemove = (clanID) => {
    fetch("https://localhost:5001/Tim/IzbaciClana/" + clanID,
          {
              method: "PUT"
          }).then(s =>{
              if(s.ok)
              {
                 //alert("uspesno je izbacen clan");
                 if(props.timID<=-1)
                  return;

                  fetch("https://localhost:5001/Tim/VratiClanoveTima/" + props.timID,
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
                        console.log(data)
                        setMembers(data)
                      });
                    }
                    else
                    {
                      alert("uneli ste pogresno korisnicko ime ili lozinku");
                    }
                  })
              }
          });
  };

  React.useEffect(() => {
    if(props.timID==-1)
    return;

    fetch("https://localhost:5001/Tim/VratiClanoveTima/" + props.timID,
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
        console.log(data)
        setMembers(data)
      });
    }
    else
    {
      alert("uneli ste pogresno korisnicko ime ili lozinku");
    }
  })
 }, [props.timID]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Members</DialogTitle>
      <List sx={{ pt: 0 }}>
        {members.filter(member => member.korisnik.id!=JSON.parse(window.localStorage.getItem('user-info')).id).map((member) => (
          <ListItem key={member.clanTimaID}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme} />
            <ThemeProvider theme={theme}>
              <Button 
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}
                onClick={() => visitProfile(member.korisnik.id)}>
                View Profile
              </Button>
              <Button
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px'}}
              onClick={()=>handleRemove(member.clanTimaID)}>
                 Remove
              </Button>
            </ThemeProvider>
          </ListItem>
        ))} 
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

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

  const [taskName , setTaskName] = React.useState('')
  const [taskType , setTaskType] = React.useState('')
  const [taskDesc ,setTaskDesc] = React.useState('')
  const [bodovi , setBodovi] = React.useState('')
  const [openD, setOpenD] = React.useState(false)
  const [value, setValue] = React.useState(0);
  const [curProj, setProj] = React.useState(-1)
  const [prevTim, setPrevTim] = React.useState(-1)
  const boje = ['rgb(147, 219, 217)', 'rgb(17, 156, 151)']
  const displej = ['none', 'inline']

  const [openSimple, setOpenSimple] = React.useState(false);

  const handleClickOpenSimple = () => {
    setOpenSimple(true);
  };

  const handleCloseSimple = (value) => {
    setOpenSimple(false);
  };


  const [projects, setProjects] = React.useState([])
  
  const showProjects = ()=>{
    const tim = window.localStorage.getItem('clanTimaID');
    console.log(tim);

    setPrevTim(props.timID);
    console.log(props.timID)
    if(props.timID<=-1)
    {
      setProjects([])
      setProj(-1)
      //localStorage.setItem('projID',-1)
      return;
    }
    fetch("https://localhost:5001/Tim/VratiProjekteTima/" + props.timID,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        res.json().then(data => {
          console.log(data);
          setProjects(data)
          if(data==undefined || data==null)
          {
            setProj(-1)
            localStorage.setItem('projID',-1)
            return;
          }
         
          if(data.length==0)
          {
            setProj(-1)
            localStorage.setItem('projID',-1)
            return;
          }
          if(prevTim==-1)
          {
            if(window.localStorage.getItem("projID") === null)
            {
              setProj(data[0].idProj)
              localStorage.setItem('projID',data[0].idProj)
            }
            else
            {
              setProj(window.localStorage.getItem('projID'))
            }
          }
          else
          {
              setProj(data[0].idProj)
              localStorage.setItem('projID',data[0].idProj)
          }
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
  }

  let navigate = useNavigate();
  // promena strane
  const routeChange = () =>{ 
    let path = `/cTT`; 
    navigate(path);
  }

  React.useEffect(() => {
     showProjects();
  }, [props.timID]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  // otvaranje i zatvaranje Dijaloga 
  const handleClick = () => {
    console.log("Otvoren dijalog")
    setOpenD(true);
  }
  const handleClose = () => {
    setOpenD(false)
  }
  async function addTask() {




  }








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
          <Button  sx={{backgroundColor: boje[0]}} 
          onClick={()=>handleClickOpenSimple()}>   
            <Typography sx={{fontWeight:'bold', color: 'white'}}>
                See Members
            </Typography>
          </Button>
          {projects.map(proj =>
          <Button  onClick={() =>{setProj(proj.idProj); localStorage.setItem('projID',proj.idProj);}} sx={{backgroundColor: curProj==proj.idProj? boje[1] : boje[0]}}>   
          <Typography sx={{fontWeight:'bold', color: 'white'}}>
              {proj.imeProj}
          </Typography>
        </Button>
            )}
          <IconButton onClick={() => {handleClick(); routeChange();}} sx={{marginLeft:"0.5%", display: (props.timID!=-1 && props.vodjaStatus)? 'inline' : 'none'}}>
            <AddIcon sx={{marginLeft:"0.5%", width: '25px', height: '25px' }}/>
          </IconButton>
            <div sx={{float: 'right'}}>
            <IconButton onClick={() => {localStorage.setItem('ProfileUser-info', -1); navigate('/Profile')}} sx={{marginLeft:"0.5%"}}>
              <AccountCircleIcon sx={{marginLeft:"0.5%", width: '50px', height: '50px' }}/>
            </IconButton>
            </div>
      </Box>
      <ThemeProvider theme={theme}>
          <Dialog open={openD} onClose={handleClose}>
             <DialogTitle>
               Define your task and its value 
             </DialogTitle>
              <DialogContent>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" label="Task Title" variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                      onChange={(e) => setTaskName(e.target.value)}
                        sx={{
                          width :"100%",
                          marginTop : "5%",
                          marginBottom : "5%",
                          }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" label="Task Type" variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                        onChange={(e) => setTaskType(e.target.value)}
                          sx={{
                           width :"100%",
                           marginTop : "5%",
                           marginBottom : "5%",
                           }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField onChange={ (e) => setTaskDesc(e.target.value) } //error={projDescError}
                      id="outlined-basic" label="Description"  variant="outlined"  type="text" color="primary" 
                          multiline 
                          required
                          rows={'5'}
                          //maxRows={'5'}  
                          sx={{ width : "100%", height: "40%"}}/>
                </ThemeProvider>

                <ThemeProvider theme={theme}>
                  <Slider 
                      value = {bodovi}
                      onChange={(e ,value ) => setBodovi(value)}
                      defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                  </ThemeProvider>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addTask}>Sumbit</Button>
             </DialogActions>
          </Dialog>
        </ThemeProvider>
      <UpProjectMenu vodjaStatus={props.vodjaStatus} projectID={curProj} timID = {props.timID} clanTimaID = {props.clanTimaID}/>
      <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                timID = {props.timID}
              />
    </div>
  );
}

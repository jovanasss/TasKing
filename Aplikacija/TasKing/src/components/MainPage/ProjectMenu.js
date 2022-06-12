import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UpProjectMenu from './UpProjectMenu';
import Slider from '@mui/material/Slider';
import { Button, IconButton, Tooltip } from '@mui/material';
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

const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

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
  const [userError , setUserError] = React.useState(false)
  const [userName , setUserName] = React.useState('')

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

  async function handleInvite(){

    // error ako je neki input prazan
    if ( userName === ''){
      setUserError(true)
    }

     // oba imaju vrednost => logovanje 
    if (userName){

      const idTim = (JSON.parse(window.localStorage.getItem('TimID')));
      console.log(idTim);

      fetch("https://localhost:5001/Tim/PozoviUTim/" + userName + "/" + idTim, {
        method: "POST"
        }).then(res =>{
          if(res.ok)
            {
              alert("zahtev je uspesno poslat");
            }
            else
            {
              res.json().then(data => {
                  if(data==1)
                  alert("korisnik ne postoji");

                  if(data==2)
                  alert("organizacija ne postoji");

                  if(data==3)
                  alert("zahtev je vec poslat");

                  if(data==4)
                  alert("korisnik je vec clan organizacije");
              });
            }
        })
    }
  }

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
      <DialogTitle style={{ backgroundColor : darkMode ? "rgb(26,25,25)":"white" , color : darkMode ? "white" : "black"}}>Members</DialogTitle>
      <DialogContent style={{ backgroundColor : darkMode ? "rgb(26,25,25)":"white" , color : darkMode ? "white": "black"}}>
      <List sx={{ pt: 0 }}>
      <div style={{marginBottom: '30px', display: props.vodjaStatus? 'inile' : 'none'}}>
      <TextField onChange={ (e) => setUserName(e.target.value) }
                  sx= {{marginLeft: '50px'}}  error={userError} id="outlined-basic" label="Username" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary"/>
      <ThemeProvider theme={theme}>
      <Button sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', marginTop: '5px'}}
       onClick={() => handleInvite()}>
        Invite
      </Button>
      </ThemeProvider>
      </div>
        {members.filter(member => member.korisnik.id!=JSON.parse(window.localStorage.getItem('user-info')).id).map((member) => (
          <ListItem key={member.clanTimaID}>
            <ListItemAvatar>
              <Avatar src={"../../profile/"+member.korisnik.profilnaSlika} sx={{ bgcolor: blue[100], color: blue[600] }}>
               {member.korisnik.korisnickoIme.slice(0,2)}
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
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', display: props.vodjaStatus? 'inile' : 'none'}}
              onClick={()=>handleRemove(member.clanTimaID)}>
                 Remove
              </Button>
            </ThemeProvider>
          </ListItem>
        ))} 
      </List>
      </DialogContent>
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
            backgroundColor:  'rgb(19, 173, 168)',
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

  const theme2 = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor:  boje[0],
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', background: "rgb(147, 219, 217)", display:'flex', minHeight:'125px' }}>
      <ThemeProvider theme={theme2}>
          <Tooltip title="Add Project">
            <IconButton onClick={() => {handleClick(); routeChange();}} sx={{marginLeft:"0.5%", display: (props.timID!=-1 && props.vodjaStatus)? 'inline' : 'none'}}>
              <AddIcon sx={{marginLeft:"0.5%", width: '25px', height: '25px' }}/>
            </IconButton>
          </Tooltip>
          </ThemeProvider>
          <List sx={{display:'flex', width: '65vw', overflow: 'auto'}}>
            <ThemeProvider theme={theme}>
          {projects.map(proj =>
          <ListItem key={proj.idProj} sx={{alignSelf: 'stretch', paddingBottom: '0', paddingTop: '0'}}>
          <Button  onClick={() =>{setProj(proj.idProj); localStorage.setItem('projID',proj.idProj);}} sx={{paddingBottom: '0', paddingTop: '0', alignSelf: 'stretch' ,backgroundColor: curProj==proj.idProj? boje[1] : boje[0]}}>   
          <Typography sx={{fontWeight:'bold', color: 'white'}}>
              {proj.imeProj}
          </Typography>
        </Button>
        </ListItem>
            )}
          </ThemeProvider>
            </List>
          <div style={{ display:'flex',   position: 'fixed',top:'30px', right: '0vw'}}>
          <ThemeProvider theme={theme}>
          <Button  sx={{backgroundColor: boje[1], width:'50%', marginRight:'1%'}} 
          onClick={()=>handleClickOpenSimple()}>   
            <Typography sx={{fontWeight:'bold', color: 'white'}}>
                See Team Members
            </Typography>
          </Button>
          </ThemeProvider>
            <IconButton onClick={() => {localStorage.setItem('ProfileUser-info', JSON.parse(window.localStorage.getItem('user-info')).id); navigate('/Profile')}} sx={{marginLeft:"0.5%"}}>
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
                vodjaStatus={props.vodjaStatus}
              />
    </div>
  );
}

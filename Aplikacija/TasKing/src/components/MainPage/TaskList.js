//import '../styles/MainPage/TaskList.css';
import React, { Component, useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, createTheme, IconButton, Tooltip} from '@mui/material';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { FormControlLabel, TextField } from "@mui/material";
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Store } from 'react-notifications-component';
import EditIcon from '@mui/icons-material/Edit';

const drawerWidth = 240
const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

const theme1 = createTheme({
  components:{
    MuiButton: {styleOverrides:{
      root: {
       "&:hover": {
         backgroundColor: "rgb(31, 206, 206);",
       },
      }
     }}  
  },
  palette: {
    primary: {
      //main: "rgb(161, 17, 161)",
      main: "rgb(0, 100, 100)",
    },
    secondary:{
      main : "rgb(0, 100, 0)",
    }
  },
});

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

  const { onClose, selectedValue, open } = props;
  const [members, setMembers] = useState([])
  
  let navigate = useNavigate();
  // promena strane
  const visitProfile = (korisnikID) =>{ 
    let path = `/Profile`; 
    localStorage.setItem('ProfileUser-info', korisnikID)
    navigate(path);
  }

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleHire = (clanID) => {
    const clanTimaID = window.localStorage.getItem('clanTimaID');
    fetch("https://localhost:5001/Task/DodeliTask/" + clanID + "/" + props.taskID+"/"+clanTimaID,
        {
            method: "PUT"
        }).then(s =>{
            if(s.ok)
            {
               //alert("uspesno je dodeljen task");
               handleClose();
            }
        });

        //zatvori se
  };


  const vratiPrijave = ()=>{
    const token = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Task/VratiPrijaveZaTask/" + props.taskID + "/" + token.value ,
  {
      method:"GET",
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => {
    if(res.ok)
    {
      res.json().then(data => {
        setMembers(data)
      });
    }
    else
    {
      alert("greska pri vracanju prijava");
    }
  })
  }

  React.useEffect(() => {
    vratiPrijave();
 }, [props]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle style={{
        backgroundColor : darkMode ? "rgb(26, 25, 25)" :"azure",
        color : darkMode ? "white" : "black"
      }}>Candidates</DialogTitle>
      <List sx={{ 
        pt: 0 ,
        backgroundColor : darkMode ? "rgb(26,25,25)" : "azure"
      }}>
        {members.map((member) => (
          <ListItem key={member.clanTimaID}>
            <ListItemAvatar>
              <Avatar src={"../../profile/"+member.korisnik.profilnaSlika} sx={{ bgcolor: blue[100], color: blue[600] }}>
                {member.korisnik.ime.charAt(0)}{member.korisnik.prezime.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme} style={{ color : darkMode ? "white" : "black"}}/>
            <ThemeProvider theme={theme1}>
              <Button
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}
                onClick ={()=>visitProfile(member.korisnik.id)}
                color="primary"
                variant="contained">
                View Profile
              </Button>
              <Button
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px'}}
              onClick={()=>{handleHire(member.clanTimaID);}}
              color="primary"
              variant="contained">
                 Hire
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



function Tasks(props)
{
  
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

const [curTask, setTask] = useState(-1)
const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
const [open, setOpen] = React.useState(false);
const [scroll, setScroll] = React.useState('paper');
const [dialogTask, setDialog] = React.useState(0);
const [tasks, setTasks] = React.useState([])
const [isVodja , setVodja] = React.useState(false)

  async function vodjaStatus () {
    if(localStorage.getItem('clanTimaID')<=-1 || localStorage.getItem('clanTimaID')===null)
    {
      setVodja(true);
      return;
    } 
    let rez = await fetch("https://localhost:5001/Tim/VratiVodjaStatus/" + localStorage.getItem('clanTimaID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    rez = await rez.json();
    let vodja  = rez.vodja;
    setVodja(vodja);
 }

 React.useEffect(() => {
  vodjaStatus();
}, [localStorage.getItem('projID')]);//props, localStorage.getItem('clanTimaID')

React.useEffect(() => {
  setTasks(props.taskovi);
}, [props.taskovi]);

const handleClickOpen = (scrollType, ind) => () => {
  setDialog(ind);
  setOpen(true);
  setScroll(scrollType);
};

const handleClose = () => {
  setDialog(-1);
  setOpen(false);
};

const [openSimple, setOpenSimple] = React.useState(false);

  const handleClickOpenSimple = () => {
    setOpenSimple(true);
  };

  const handleCloseSimple = (value) => {
    setOpenSimple(false);
    refreshTasks();
  };

const refreshTasks = () => {


  fetch("https://localhost:5001/Tim/VratiProjekat/" + props.projectID + "/" + localStorage.getItem('clanTimaID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        res.json().then(data => {
          setTasks(data.projekatInfo.taskovi)
        });
      }
      else
      {
        alert("greska pri refreshovanju taskova");
      }
    })
}  

const handleAll = (taskID, currentStatus, prijaveLenght) => {

  if(isVodja)
  {
    if(currentStatus==0)
    {
      handleSeeCandidats(taskID);
      return;
    }

    if(currentStatus==1)
    {
      return;
    }

    if(currentStatus==2)
    {
      handleChangeStatus(taskID, 3);
      window.location.reload(false);
      return;
    }

    if(currentStatus==3)
    {
      return;
    }

    if(currentStatus==4)
    {
      return;
    }
  }
  else
  {
    if(currentStatus==0)
    {

      if(prijaveLenght==0)
        handleImIntrested(taskID);
      else
        handleImNotIntrested(taskID);

      return;
    }

    if(currentStatus==1)
    {
      handleChangeStatus(taskID, 2);
      return;
    }

    if(currentStatus==2)
    {
      return;
    }

    if(currentStatus==3)
    {
      return;
    }

    if(currentStatus==4)
    {
      handleChangeStatus(taskID, 2);
      return;
    }
  }
}


const buttonTexts = (taskID, currentStatus, prijaveLenght) => {

  if(isVodja)
  {
    if(currentStatus==0)
    {
      return "Pick"
    }

    if(currentStatus==1)
    {
      return;
    }

    if(currentStatus==2)
    {
      return "Aproove"
    }

    if(currentStatus==3)
    {
      return;
    }

    if(currentStatus==4)
    {
      return;
    }
  }
  else
  {
    if(currentStatus==0)
    {
      if(prijaveLenght==0)
        return "I'm intrested"
      else
      return "I'm not intrested"

    }

    if(currentStatus==1)
    {
      return "Send for review";
    }

    if(currentStatus==2)
    {
      return;
    }

    if(currentStatus==3)
    {
      return;
    }

    if(currentStatus==4)
    {
      return "Send for review";
    }
  }
}

let navigate = useNavigate();
  // promena strane
  const visitProfile = (korisnikID) =>{ 
    let path = `/Profile`; 
    localStorage.setItem('ProfileUser-info', korisnikID)
    navigate(path);
  }



  const handleImIntrested = (taskID) => {

   fetch("https://localhost:5001/Task/PrijaviZaTask/" + localStorage.getItem('clanTimaID') + "/" + taskID, {
   method: "POST"
  }).then(s =>{
    if(s.ok)
    {
    refreshTasks();
    }
    else
    {
      alert("your role doesn't allow you this function");
    }
  })
};

const handleImNotIntrested = (taskID) => {


  fetch("https://localhost:5001/Task/PonistiPrijavuZaTask/" + localStorage.getItem('clanTimaID') +"/"+taskID,
    {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
    }).then(s =>{
      refreshTasks();
    })
};

const handleSeeCandidats = (taskID) => {
  setTask(taskID);
  handleClickOpenSimple();
};

const handleChangeStatus = (taskID, status) => {
  const clanTimaID = localStorage.getItem('clanTimaID');
  fetch("https://localhost:5001/Task/PromeniStatus/" + taskID + "/" + status + "/" + clanTimaID,
        {
            method: "PUT"
        }).then(s =>{
          refreshTasks();
            if(s.ok)
            {
               //alert("uspesno je dodeljen task");
            }
        });
};

const descriptionElementRef = React.useRef(null);
React.useEffect(() => {
  if (open) {
    const { current: descriptionElement } = descriptionElementRef;
    if (descriptionElement !== null) {
      descriptionElement.focus();
    }
  }
}, [open]);

const boja1 = () => {
  return  darkMode? "rgb(192, 192, 192)" : "rgb(255,255,255)";
}

const tekstoviClan = ["I'm intreseted", "Cancel", "Done", ""]
const tekstoviVodja = ["Edit", "Pick", "", "Review"]
const tekstovi = [tekstoviClan, tekstoviVodja]
const displejClan = ['inline', 'inline', 'none', 'none', 'inline']
const displejVodja = ['inline', 'none', 'inline', 'none', 'none']
const displej = [displejClan, displejVodja]
const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
const boje = [boja1(),'rgb(77, 154, 255)', 'rgb(255, 207, 49)', 'rgb(78, 255, 93)', 'rgb(255, 87, 69)']

const [openDChangeTask, setOpenDChangeTask] = React.useState(false);
const [t, setT] = React.useState(null);
const [taskID, setTaskID] = React.useState(null);
const [taskName , setTaskName] = React.useState('');
const [taskType , setTaskType] = React.useState('');
const [taskDesc ,setTaskDesc] = React.useState('');
const [nameError , setNameError] = useState(false)
const [typeError , setTypeError] = useState(false)
const [descError , setDescError] = useState(false)
const [bodovi , setBodovi] = React.useState(0);
const [open3, setOpen3] = React.useState(false);
const [curTaskID, setCurTaskId] = React.useState(false);

const handleClickChangeTask = (id) => {
  const token = JSON.parse(window.localStorage.getItem('user-info'));
  fetch("https://localhost:5001/Task/VratiTask/"+id + "/" + token.value,
  {
      method:"GET",
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => {
      res.json()
      .then(data => {
          setT(data);
          setTaskID(data.id);
          setTaskName(data.naziv);
          setTaskType(data.tip);
          setTaskDesc(data.opis);
          setBodovi(data.vrednost);
          setOpenDChangeTask(true);
      });
  })
}

function getnaziv(e){
  setTaskName(e.target.value);
}

function getopis(e){
  setTaskDesc(e.target.value);
}

function gettip(e){
  setTaskType(e.target.value);
}

function getbodovi(e){
  setBodovi(e.target.value);
}

const handleCloseChangeTask = () => {
  setOpenDChangeTask(false)
}

const handleClickOpen3 = () => {
  setOpen3(true);
};

const handleClose3 = () => {
  setOpen3(false);
};

function changeTask(){

  if ( taskName === ''){
    setNameError(true)
  }
  else
  {
    setNameError(false)
  }

  if ( taskType === ''){
    setTypeError(true)
  } 
  else
  {
    setTypeError(false)
  }

  if ( taskDesc === ''){
    setDescError(true)
  } 
  else
  {
    setDescError(false)
  }

  if (!taskName || !taskType || !taskDesc){
    return;
  }

  if (bodovi == 0)
      {
        Store.addNotification({
          title: "Enter the number of points",
          message: "You did not enter a number of points",
          type: "danger",
          insert: "top",
          container: "top-center",
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }

  const clanTimaID = window.localStorage.getItem('clanTimaID');
  const ProjID = window.localStorage.getItem('projID');
  fetch("https://localhost:5001/Task/IzmeniTask/"+taskID+"/"+taskName+"/"+taskDesc+"/"+taskType+"/"+bodovi+"/"+clanTimaID+"/"+ProjID,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
        }).then(res => {
          res.json()
          .then(data => {
            //console.log(data);
             if(data === 0){
                //console.log(data);
                Store.addNotification({
                  title: "Warning!",
                  message: "The task with this name already exist!",
                  type: "warning",
                  insert: "top",
                  container: "top-center",
                  dismiss: {
                    duration: 2000,
                    onScreen: true
                  }
                });
              }
              else if(data === 1){
                Store.addNotification({
                  title: "Warning!",
                  message: "The task doesn't exist!",
                  type: "warning",
                  insert: "top",
                  container: "top-center",
                  dismiss: {
                    duration: 2000,
                    onScreen: true
                  }
                });
              }
              else if(data === 2){
              setOpenDChangeTask(false);
              window.location.reload(false);
              }
          }
          )
      })
}

if(tasks==undefined || tasks==null)
  return;

if(tasks.length == 0)
  return;

//primary={member.korisnik.korisnickoIme} 
//onClick={()=>handleHire()}

if(tasks.filter(task => ((task.status==props.selected-1 || (props.selected==0 && task.status!=3))&&task.status!=-1)).length==0)
{
  return;
}


return(
      <div style={{display: 'flex', flexDirection:'row'}}>
              {tasks.filter(task => ((task.status==props.selected-1 || (props.selected==0 && task.status!=3))&&task.status!=-1)).slice(0).reverse().map((task, index) => (
                <React.Fragment key={task.taskID}>
              <Box sx={{ minWidth: 280, maxWidth: 340 ,margin:"0.5%", alignSelf:'centar', marginLeft:'5px', marginTop:'25px' }}>
                <Card variant="outlined" 
                  sx={{
                    boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)", 
                    backgroundColor:boje[task.status], marginBottom:'10px', 
                    borderStyle:"dotted", 
                    borderWidth:"thick", 
                    borderColor:"rgb(0, 100, 0)",
                    borderRadius:"20px"}}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {task.naziv.slice(0,70) + (task.naziv.length>70? "..." : "")}
                      </Typography>
                      <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        {"Descripiton: " + task.opisTaska.slice(0,150) + (task.opisTaska.length>150? "..." : "")}
                      </Typography>
                      <Typography sx={{ mb: 1.5, fontSize:15 , fontWeight: 'bold' }} color="text.primary">
                        points: {task.vrednost} 
                      </Typography>
                      <div style={{display: (task.korisnikID!=-1 && isVodja)? 'flex' : 'none'}}>
                      <ListItemAvatar>
                        <Avatar src={"../../profile/"+task.slika} sx={{ bgcolor: blue[100], color: blue[600] }}>
                          {task.korisnickoIme.slice(0,2)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={task.korisnickoIme}/>
                        <Button
                          sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px', color: 'black'}}
                          onClick ={()=>{ if(task.korisnikID!=-1)
                          {visitProfile(task.korisnikID)}}}>
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                    <CardActions>
                      <ThemeProvider theme={theme1}>
                      <Button
                          onClick={handleClickOpen('paper', index)} 
                          //aria-describedby={id} 
                          variant="contained" 
                          //onClick={handleClick}
                          sx={{ border:"2px solid black", borderRadius:"10px"}}
                          color="primary">
                          See more
                        </Button>
                        <Button 
                          //aria-describedby={id} 
                          variant="contained" 
                          //onClick={()=>handleAll(task.taskID, task.status, task.prijave.length)}
                          //onClick={()=>handleImIntrested(task.taskID)}
                          onClick={()=>handleChangeStatus(task.taskID, 4)}
                          sx={{ border:"2px solid black", borderRadius:"10px", display: (isVodja && task.status==2)? 'inline' : 'none', padding:'10px 0 10px 0', fontSize:'13px', width:'40%'}}
                          color="primary">
                              Return
                        </Button>
                        <Button 
                          //aria-describedby={id} 
                          variant="contained" 
                          onClick={()=>handleAll(task.taskID, task.status, task.prijave.length)}
                          //onClick={()=>handleImIntrested(task.taskID)}
                          //onClick={()=>handleChangeStatus(task.taskID, 2)}
                          sx={{ border:"2px solid black", borderRadius:"10px", display: displej[isVodja? 1 : 0][task.status], padding: task.status==2? '10px 0 10px 0' : '10px 10px 10px 10px', fontSize:'13px',  width: task.status==2? '40%' : 'auto'}}
                          color="primary">
                            {buttonTexts(task.taskID, task.status, task.prijave.length)}
                        </Button>
                        <IconButton
                          onClick={()=>handleClickChangeTask(task.taskID)}
                          //aria-describedby={id} 
                          variant="contained" 
                          sx={{ border:"2px solid black", borderRadius:"10px", display:(task.status==0 && isVodja)? 'inline' : 'none'}}
                          color="primary">
                            <EditIcon/>
                        </IconButton>
                        <IconButton
                          onClick={()=>{setCurTaskId(task.taskID); handleClickOpen3();}}
                          //aria-describedby={id} 
                          variant="contained" 
                          sx={{ border:"2px solid black", borderRadius:"10px", display:(task.status==0 && isVodja)? 'inline' : 'none'}}
                          color="primary">
                            <DeleteForeverIcon/>
                        </IconButton>
                      </ThemeProvider> 
                    </CardActions>
                </Card>
              </Box>
              </React.Fragment>
               ))}
              {dialogTask!=-1
              ?
              <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby={"scroll-dialog-title"}
                aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title" style={{ 
                    backgroundColor : darkMode ? "rgb(26,25,25)" : "white" ,
                    color : darkMode ? "white "  : "black",
                     }} >
                      {tasks.filter(task => ((task.status==props.selected-1 || (props.selected==0 && task.status!=3))&&task.status!=-1)).slice(0).reverse()[dialogTask].naziv
                      + " (" + tasks.filter(task => ((task.status==props.selected-1 || (props.selected==0 && task.status!=3))&&task.status!=-1)).slice(0).reverse()[dialogTask].tip +")"}</DialogTitle>
                  <DialogContent dividers={scroll === 'paper'} style={{backgroundColor : darkMode ? "rgb(26,25,25)" : "white",}} >
                    <DialogContentText
                      id="scroll-dialog-description"
                      ref={descriptionElementRef}
                      tabIndex={-1}
                      style={{
                        color : darkMode ? "white" : "black",
                      }}>
                      {tasks.filter(task => ((task.status==props.selected-1 || (props.selected==0 && task.status!=3))&&task.status!=-1)).slice(0).reverse()[dialogTask].opisTaska}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions style={{
                    backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
                  }}>
                  <ThemeProvider theme={theme1}><Button onClick={handleClose} variant="contained" color="primary" >ok</Button></ThemeProvider>
                  </DialogActions>
              </Dialog>
              :
              null
              }
              <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                taskID = {curTask}
              />

        <ThemeProvider theme={theme}>
          <Dialog open={openDChangeTask} onClose={handleClose}>
             <DialogTitle style={{
                backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                color : darkMode ? "white" : "black",
             }}>
               Edit task 
             </DialogTitle>
              <DialogContent style={{
                 backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
              }}>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" defaultValue={t==undefined ? " " : t.naziv} label="Task Title" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                      error={nameError} onChange={getnaziv}
                        sx={{
                          width :"100%",
                          marginTop : "5%",
                          marginBottom : "5%",
                          }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" defaultValue={t==undefined ? " " : t.tip} label="Task Type"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                      error={typeError}  onChange={gettip}
                          sx={{
                           width :"100%",
                           marginTop : "5%",
                           marginBottom : "5%",
                           }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField  //error={projDescError}
                     onChange={getopis}
                     error={descError} id="outlined-basic" defaultValue={t==undefined ? " " : t.opis} label="Description"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" 
                          multiline 
                          required
                          rows={'5'}
                          //maxRows={'5'}  
                          sx={{ width : "100%", height: "40%"}}/>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Slider 
                      //value = {bodovi}
                      onChange={getbodovi}
                      defaultValue={t==undefined ? 0 : parseInt(t.vrednost)} aria-label="Default" valueLabelDisplay="auto" />
                  </ThemeProvider>
              </DialogContent>
              <DialogActions style={{
                 backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
              }}>
               <ThemeProvider theme={theme1} ><Button onClick={handleCloseChangeTask} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
              <ThemeProvider theme={theme1}><Button onClick={changeTask} variant="contained" color="primary" sx={{fontWeight:"bold"}}>Sumbit</Button></ThemeProvider>
             </DialogActions>
          </Dialog>
          <Dialog
          open={open3}
          onClose={handleClose3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" ,backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Delete Task"}
              </DialogTitle>
              <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
              <DialogContentText id="alert-dialog-description" style={{ color : darkMode ? "white"  : "black"}}>
                Are you sure you want to delete this task?
              </DialogContentText>
            </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme1}><Button onClick={handleClose3} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme1}>
                   <Button onClick={()=>{handleChangeStatus(curTaskID, -1); handleClose3();}} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Delete
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
    </div>
)
}


function TaskList(props){


  const [taskName , setTaskName] = React.useState('')
  const [taskType , setTaskType] = React.useState('')
  const [taskDesc ,setTaskDesc] = React.useState('')
  const [nameError , setNameError] = useState(false)
  const [typeError , setTypeError] = useState(false)
  const [descError , setDescError] = useState(false)
  const [bodovi , setBodovi] = React.useState(0)
  const [openD, setOpenD] = React.useState(false)
  const [change, setChange] = React.useState(false)
  const [tasks, setTasks] = React.useState([])
  const [isVodja , setVodja] = React.useState(false)

  async function vodjaStatus () {
    if(localStorage.getItem('clanTimaID')<=-1 || localStorage.getItem('clanTimaID')===null)
    {
      setVodja(true);
      return;
    }
    let rez = await fetch("https://localhost:5001/Tim/VratiVodjaStatus/" + localStorage.getItem('clanTimaID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    rez = await rez.json();
    let vodja  = rez.vodja;
    setVodja(vodja);
 }

 React.useEffect(() => {
  vodjaStatus();
}, [props, localStorage.getItem('clanTimaID')]);

  React.useEffect(() => {
    setTasks(props.taskovi);
  }, [props.taskovi]);

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

    // otvaranje i zatvaranje Dijaloga 
    const handleClick = () => {
      setOpenD(true);
    }
    const handleClose = () => {
      setOpenD(false)
    }
    async function addTask() {

      if ( taskName === ''){
        setNameError(true)
      }
      else
      {
        setNameError(false)
      }

      if ( taskType === ''){
        setTypeError(true)
      } 
      else
      {
        setTypeError(false)
      }

      if ( taskDesc === ''){
        setDescError(true)
      } 
      else
      {
        setDescError(false)
      }

      if (!taskName || !taskType || !taskDesc){
        return;
      }

      if (bodovi == 0)
      {
        Store.addNotification({
          title: "Enter the number of points",
          message: "You did not enter a number of points",
          type: "danger",
          insert: "top",
          container: "top-center",
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }
      //setOpenD(false)
      const idProjekta = (JSON.parse(window.localStorage.getItem('projID')));

      let task = {
        naziv: taskName ,
        tip : taskType ,
        opis : taskDesc ,
        bodovi : bodovi,
        projekatID  : idProjekta
    };

    const clanTimaID = window.localStorage.getItem('clanTimaID');
    let result = await fetch("https://localhost:5001/Task/KreirajTask/" + clanTimaID, {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
      body : JSON.stringify(task)
    });
    let statusT = result.status;
    result = await result.json();
    if (result === 0){
      Store.addNotification({
        title: "Task with such name already exists in your project",
        message: "Make a task with a different name",
        type: "danger",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      return;
    }


    fetch("https://localhost:5001/Tim/VratiProjekat/" + props.projectID  + "/" + localStorage.getItem('clanTimaID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        res.json().then(data => {
          setTasks(data.projekatInfo.taskovi)
        });
      }
      else
      {
        alert("Greska pri vracanju informacija o projektu");
      }
    })
    
      setOpenD(false)
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

  const displejPlus = ['none', 'inline']

  return(
        <div className="divTasks">
                <Box className='addBtnBox' sx={{margin:"0.5%", display: displejPlus[(props.vodjaStatus && isVodja && props.projectID!=-1)? 1 : 0], alignSelf:'center' }}>
                  <Card variant="outlined" 
                    className='addCard'
                    sx={{minWidth: 250, maxWidth: 340, minHeight: 250, maxHeight: 340, boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)", backgroundColor: darkMode? "rgb(192,192,192)" : "white", }}>
                      <CardContent>
                      </CardContent>
                      <CardActions>
                        <ThemeProvider theme={theme}>
                          <Tooltip title="Add Task">
                          <IconButton className='addBtn' onClick={handleClick}>
                            <AddIcon sx={{minWidth: 150, maxWidth: 300, minHeight: 150, maxHeight: 300}}/>
                          </IconButton>
                          </Tooltip>
                        </ThemeProvider> 
                      </CardActions>
                  </Card>
                </Box>
                <ThemeProvider theme={theme}>
          <Dialog open={openD} onClose={handleClose}>
             <DialogTitle style={{
                backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                color : darkMode ? "white" : "black",
             }}>
               Define your task and its value 
             </DialogTitle>
              <DialogContent style={{
                 backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
              }}>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" label="Task Title" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                    error={nameError}  onChange={(e) => setTaskName(e.target.value)}
                        sx={{
                          width :"100%",
                          marginTop : "5%",
                          marginBottom : "5%",
                          }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField id="outlined-basic" label="Task Type"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                      error={typeError}  onChange={(e) => setTaskType(e.target.value)}
                          sx={{
                           width :"100%",
                           marginTop : "5%",
                           marginBottom : "5%",
                           }}/>                      
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField onChange={ (e) => setTaskDesc(e.target.value) } //error={projDescError}
                      error={descError} id="outlined-basic" label="Description"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" 
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
              <DialogActions style={{
                 backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
              }}>
               <ThemeProvider theme={theme1} ><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
              <ThemeProvider theme={theme1}><Button onClick={addTask} variant="contained" color="primary" sx={{fontWeight:"bold"}}>Sumbit</Button></ThemeProvider>
             </DialogActions>
          </Dialog>
        </ThemeProvider>
                <Tasks selected={props.selected} vodjaStatus={props.vodjaStatus} taskovi = {tasks} change = {change} projectID = {props.projectID}/>
      </div>
)
}

export default TaskList;

//import '../styles/MainPage/TaskList.css';
import React, { Component, useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, createTheme, IconButton} from '@mui/material';
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

const drawerWidth = 240

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

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleHire = () => {
    const clanID = window.localStorage.getItem('clanTimaID');
    fetch("https://localhost:5001/Task/DodeliTask/" + clanID + "/" + props.taskID,
        {
            method: "PUT"
        }).then(s =>{
            if(s.ok)
            {
               //alert("uspesno je dodeljen task");
            }
        });
  };

  React.useEffect(() => {
    fetch("https://localhost:5001/Task/VratiPrijaveZaTask/" + props.taskID,
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
        /*setOrganisations(data)
        if(data==undefined || data==null)
        return;
      
        if(data.length==0)
          return;  
        console.log(data[0].idClan);
        setOrg(data[0].idClan)
        localStorage.setItem('clanOrgID',data[0].idClan)*/
      });
    }
    else
    {
      alert("uneli ste pogresno korisnicko ime ili lozinku");
    }
  })
 }, [props.taskID]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Candidates</DialogTitle>
      <List sx={{ pt: 0 }}>
        {members.map((member) => (
          <ListItem key={member.clanTimaID}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme} />
            <ThemeProvider theme={theme}>
              <Button
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}>
                View Profile
              </Button>
              <Button
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px'}}
              onClick={()=>handleHire()}>
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
const [open, setOpen] = React.useState(false);
const [scroll, setScroll] = React.useState('paper');
const [dialogTask, setDialog] = React.useState(0);
const [tasks, setTasks] = React.useState([])

React.useEffect(() => {
  setTasks(props.taskovi);
}, [props.taskovi]);

const handleClickOpen = (scrollType, ind) => () => {
  setDialog(ind);
  setOpen(true);
  setScroll(scrollType);
};

const handleClose = () => {
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
  fetch("https://localhost:5001/Tim/VratiProjekat/" + props.projectID,
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
          setTasks(data.taskovi)
        });
      }
      else
      {
        alert("");
      }
    })
}  

const handleAll = (taskID, currentStatus) => {

  if(props.vodjaStatus)
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
      handleImIntrested(taskID);
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

  const handleImIntrested = (taskID) => {
  const clanID = window.localStorage.getItem('clanTimaID');
  console.log(taskID + "taskID");
  console.log(clanID +  " clanID");
   fetch("https://localhost:5001/Task/PrijaviZaTask/" + clanID + "/" + taskID, {
   method: "POST"
  }).then(s =>{
    refreshTasks();
  })
};

const handleImNotIntrested = (taskID) => {
  const clanID = window.localStorage.getItem('clanTimaID');
  console.log(taskID + "taskID");
  console.log(clanID +  " clanID");
   fetch("https://localhost:5001/Task/PrijaviZaTask/" + clanID + "/" + taskID, {
   method: "POST"
  }).then(s =>{
    refreshTasks();
  })
};

const handleSeeCandidats = (taskID) => {
  console.log(taskID + "taskID");
  setTask(taskID);
  handleClickOpenSimple();
};

const handleChangeStatus = (taskID, status) => {
  console.log(taskID + "taskID");
  fetch("https://localhost:5001/Task/PromeniStatus/" + taskID + "/" + status,
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

const tekstoviClan = ["I'm intreseted", "Cancel", "Done", ""]
const tekstoviVodja = ["Edit", "Pick", "", "Review"]
const tekstovi = [tekstoviClan, tekstoviVodja]
const displejClan = ['inline', 'inline', 'inline', 'none', 'none']
const displejVodja = ['inline', 'inline', 'none', 'inline', 'none']
const displej = [displejClan, displejVodja]
const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
const boje = ['rgb(255, 255, 255)', 'rgb(255, 207, 49)', 'rgb(77, 154, 255)', 'rgb(78, 255, 93)']

if(tasks==undefined || tasks==null)
  return;

if(tasks.length == 0)
  return;

return(
      <div className="divTasks">
              {tasks.filter(task => (task.status==props.selected-1 || (props.selected==0 && task.status<4))).map((task, index) => (
              <Box sx={{ minWidth: 280, maxWidth: 340 ,margin:"0.5%" }}>
                <Card variant="outlined" 
                  sx={{boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)", backgroundColor:boje[task.status], marginBottom:'10px' }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {task.naziv.slice(0,70) + (task.naziv.length>70? "..." : "")}
                      </Typography>
                      <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        {"Descripiton: " + task.opisTaska.slice(0,150) + (task.opisTaska.length>150? "..." : "")}
                      </Typography>
                      <Typography sx={{ mb: 1.5, fontSize:15 , fontWeight: 'bold' }} color="text.primary">
                        poeni: {task.vrednost} 
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <ThemeProvider theme={theme}>
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
                          onClick={()=>handleAll(task.taskID, task.status)}
                          //onClick={()=>handleImIntrested(task.taskID)}
                          //onClick={()=>handleChangeStatus(task.taskID, 2)}
                          sx={{ border:"2px solid black", borderRadius:"10px", display: displej[props.vodjaStatus? 1 : 0][task.status]}}
                          color="primary">
                            {tekstovi[props.vodjaStatus? 1 : 0][task.status]}
                        </Button>
                      </ThemeProvider> 
                    </CardActions>
                </Card>
              </Box>
              
               ))}
              <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby={"scroll-dialog-title"}
                aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title">{tasks[dialogTask].naziv}</DialogTitle>
                  <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                      id="scroll-dialog-description"
                      ref={descriptionElementRef}
                      tabIndex={-1}>
                      {tasks[dialogTask].opisTaska}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose}>ok</Button>
                  </DialogActions>
              </Dialog>
              <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                taskID = {curTask}
              />
    </div>
)
}


function TaskList(props){


  const [taskName , setTaskName] = React.useState('')
  const [taskType , setTaskType] = React.useState('')
  const [taskDesc ,setTaskDesc] = React.useState('')
  const [bodovi , setBodovi] = React.useState('')
  const [openD, setOpenD] = React.useState(false)
  const [change, setChange] = React.useState(false)
  const [tasks, setTasks] = React.useState([])

  React.useEffect(() => {
    setTasks(props.taskovi);
  }, [props.taskovi]);

    // otvaranje i zatvaranje Dijaloga 
    const handleClick = () => {
      console.log("Otvoren dijalog")
      setOpenD(true);
    }
    const handleClose = () => {
      setOpenD(false)
    }
    async function addTask() {

      setOpenD(false)
      const idProjekta = (JSON.parse(window.localStorage.getItem('projID')));
      console.log(idProjekta);

      let task = {
        naziv: taskName ,
        tip : taskType ,
        opis : taskDesc ,
        bodovi : bodovi,
        projekatID  : idProjekta
    };
    console.log(task);

    let result = await fetch("https://localhost:5001/Task/KreirajTask/", {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
      body : JSON.stringify(task)
    });
    let statusT = result.status;
    result = await result.json();
    console.log(statusT);
    if (result === 0){
      alert("Task sa unetim imenom vec postoji !");
    }

    fetch("https://localhost:5001/Tim/VratiProjekat/" + props.projectID,
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
          setTasks(data.taskovi)
        });
      }
      else
      {
        alert("");
      }
    })
    
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
                <Box className='addBtnBox' sx={{margin:"0.5%", display: displejPlus[props.vodjaStatus? 1 : 0] }}>
                  <Card variant="outlined" 
                    className='addCard'
                    sx={{minWidth: 250, maxWidth: 340, minHeight: 250, maxHeight: 340, boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)"}}>
                      <CardContent>
                      </CardContent>
                      <CardActions>
                        <ThemeProvider theme={theme}>
                          <IconButton className='addBtn' onClick={handleClick}>
                            <AddIcon sx={{minWidth: 150, maxWidth: 300, minHeight: 150, maxHeight: 300}}/>
                          </IconButton>
                        </ThemeProvider> 
                      </CardActions>
                  </Card>
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
                <Tasks selected={props.selected} vodjaStatus={props.vodjaStatus} taskovi = {tasks} change = {change} projectID = {props.projectID}/>
      </div>
)
}

export default TaskList;

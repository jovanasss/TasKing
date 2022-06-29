import * as React from 'react';
import '../../styles/MainPage/ProjectDescription.css';
import { AppBar, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {ThemeProvider} from "@mui/system";
import { createTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { Store } from 'react-notifications-component';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate } from 'react-router-dom';

export default function ProjectDescription(props) {

  const [project, setProject] = React.useState([]);
  const [error ,setError] = React.useState(false);

  React.useEffect(() => {
    setProject(props.Project);
    if (error === true){
      Navigate("/Main");
    }
  }, [props]);

  //console.log(project);
  let canDelete = 0;
  {props.Project.taskovi==undefined ? void(0) : props.Project.taskovi.forEach(t =>{
    if(t.status > 0){
      canDelete++;
    }
  })}
  //console.log(canDelete);
  //console.log(props.ProjectID);

  const theme = createTheme({
    components:{
      MuiButton: {styleOverrides:{
        root: {
         "&:hover": {
           backgroundColor: "rgb(31, 206, 206)",
         },
        }
       }},
    },
    palette: {
      primary: {
        main: "rgb(0, 100, 100)",
      },
      secondary:{
        main : "rgb(0, 100, 0)",
      }
    },
  });

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [projectName, setProjectName] = React.useState(null);
  const [projectDescription, setProjectDescription] = React.useState(null);

  function getProjectName(e){
    setProjectName(e.target.value);
  }

  function getProjectDescription(e){
    setProjectDescription(e.target.value);
  }

  function changeProjectName(){
    if(projectName == null){
      Store.addNotification({
        title: "Warning!",
        message: "The field project title must be filled in!",
        type: "warning",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      return
    }

    if(projectName.length == 0){
      Store.addNotification({
        title: "Warning!",
        message: "The field project title must be filled in!",
        type: "warning",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      return
    }

    const clanTimaID = window.localStorage.getItem('clanTimaID');
    const TimID = window.localStorage.getItem('TimID');
    //console.log(projectName);

    fetch("https://localhost:5001/Projekat/PromeniImeProjekta/"+props.ProjectID+"/"+ projectName + "/"+ clanTimaID + "/" + TimID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    }).then(res => {
      res.json()
      .then(data => {
        //console.log(data);
         if(data <= 0){
          setError(true);
          Store.addNotification({
            title: "Warning!",
            message: "Invalid Token",
            type: "warning",
            insert: "top",
            container: "top-center",
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
          setOpen1(false);
          Navigate("/");
         }
         else if(data === 0){
            //console.log(data);
            Store.addNotification({
              title: "Warning!",
              message: "The project with this name already exist!",
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
              message: "The project doesn't exist!",
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
            Store.addNotification({
              title: "Success!",
              message: "You successfully changed the project name",
              type: "success",
              insert: "top",
              container: "top-center",
              dismiss: {
                duration: 2000,
                onScreen: true
              }
            });
            setOpen1(false);
          window.location.reload(false);
          }
      }
      )
  })

  }

  function changeProjectDescription(){
    if(projectDescription == null){
      Store.addNotification({
        title: "Warning!",
        message: "The field project description must be filled in!",
        type: "warning",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      return
    }

    if(projectDescription.length == 0){
      Store.addNotification({
        title: "Warning!",
        message: "The field project description must be filled in!",
        type: "warning",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      return
    }

    const clanTimaID = window.localStorage.getItem('clanTimaID');
    fetch("https://localhost:5001/Projekat/PromeniOpisProjekta/"+props.ProjectID+"/"+projectDescription+"/"+clanTimaID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    }).then(res => {
      res.json().then(data => {
        if (data === -2){
          alert("Invalid token");
        }
        else if (data === -1){
          alert("Not a team admin");
        }
      })
    })
    setOpen2(false);
    window.location.reload(false);
    return
  }

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const [isVodja , setVodja] = React.useState(true);
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
    //console.log(rez);
    let vodja  = rez.vodja;
    setVodja(vodja);
 }

 React.useEffect(() => {
  vodjaStatus();
}, [props]);

function deleteProject(){
  const clanTimaID = window.localStorage.getItem('clanTimaID');
  fetch("https://localhost:5001/Projekat/ObrisiProjekat/"+props.ProjectID+"/"+clanTimaID,
  {
      method:"DELETE",
      headers:{
          "Content-Type":"application/json"
      },
  });
  localStorage.removeItem('projID');
  window.location.reload(false);
}

  return (
    <div className={darkMode ? "descriptionDivDM" :'descriptionDiv'}>
        {isVodja && canDelete==0 && props.ProjectID>=0
        ?
        <div className="divProjectNameDescription">
        <Tooltip title="change project title">
          <h2 onClick={()=>handleClickOpen1()} style={{marginTop:"2%", color : darkMode ? "white" : "black"}} className="h2EditProjectNameVodja">{props.ProjectName}</h2>
        </Tooltip>
        <ThemeProvider theme={theme}>
        <IconButton 
        onClick={()=>handleClickOpen3()} 
        variant="contained" 
        sx={{ border:"2px solid black", borderRadius:"10px", marginLeft:"1%", height:"35px", color : darkMode ? "white" : "black"}}
        color="primary">
          <DeleteForeverIcon />
        </IconButton>
        </ThemeProvider>
        <Tooltip title="change project description" placement="bottom-start">
           <Typography onClick={()=>handleClickOpen2()} className="EditProjectDescriptionVodja" sx={{marginTop:"10px", marginLeft:"1%", width:"85%", color : darkMode ? "white" : "black"}}>
          {props.ProjectDescription}
        </Typography>
        </Tooltip>
        </div>
        :
        isVodja && props.ProjectID>=0
        ?
        <div className="divProjectNameDescription">
        <Tooltip title="change project title">
          <h2 onClick={()=>handleClickOpen1()} style={{marginTop:"2%", color : darkMode ? "white" : "black"}} className="h2EditProjectNameVodja">{props.ProjectName}</h2>
        </Tooltip>
        <Tooltip title="change project description" placement="bottom-start">
           <Typography onClick={()=>handleClickOpen2()} className="EditProjectDescriptionVodja" sx={{marginTop:"10px", marginLeft:"1%", width:"85%", color : darkMode ? "white" : "black"}}>
          {props.ProjectDescription}
        </Typography>
        </Tooltip>
        </div>
        :
        <div className="divProjectNameDescription">
        <h2 style={{marginTop:"2%", color : darkMode ? "white" : "black"}} className="h2EditProjectName">{props.ProjectName}</h2>
        <Typography className="EditProjectDescription" sx={{marginTop:"10px", marginLeft:"1%", width:"85%", color : darkMode ? "white" : "black"}}>
          {props.ProjectDescription}
        </Typography>
        </div>
        }

        <Dialog
          open={open1}
          onClose={handleClose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" ,backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Change project title"}
              </DialogTitle>
              <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
             <ThemeProvider theme={theme}>
                      <TextField onChange={getProjectName} id="outlined-basic3"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white': "black"}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} label="New project title" variant="outlined" type="text" color="primary" sx ={{marginTop:"3%", marginLeft:"5%", maxWidth: "85%",backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"  }}/>
              </ThemeProvider>
              </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme}><Button onClick={handleClose1} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>changeProjectName()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Submit
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>

          <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" ,backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Change project description"}
              </DialogTitle>
            <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
             <ThemeProvider theme={theme}>
                      <TextField rows={"6"} multiline onChange={getProjectDescription} id="outlined-basic3"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white': "black"}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} label="New project description" variant="outlined" type="text" color="primary" sx ={{marginLeft:"5%", marginTop:"2%", width: "90%", backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black" }}/>
              </ThemeProvider>
              </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme}><Button onClick={handleClose2} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>changeProjectDescription()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Submit
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>

          <Dialog
          open={open3}
          onClose={handleClose3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" ,backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Delete Project"}
              </DialogTitle>
              <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
              <DialogContentText id="alert-dialog-description" style={{ color : darkMode ? "white"  : "black"}}>
                Are you sure you want to delete this project?
              </DialogContentText>
            </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme}><Button onClick={handleClose3} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>deleteProject()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Delete
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
    </div>
  );
}
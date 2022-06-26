import * as React from 'react';
import '../../styles/MainPage/ProjectDescription.css';
import { AppBar, Toolbar, Typography } from '@mui/material';
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

export default function ProjectDescription(props) {

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

    fetch("https://localhost:5001/Projekat/PromeniImeProjekta/"+props.ProjectID+"/"+projectName,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    setOpen1(false);
    window.location.reload(false);
    return
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

    fetch("https://localhost:5001/Projekat/PromeniOpisProjekta/"+props.ProjectID+"/"+projectDescription,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
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
    console.log(rez);
    let vodja  = rez.vodja;
    setVodja(vodja);
 }

 React.useEffect(() => {
  vodjaStatus();
}, [props]);

  return (
    <div className={darkMode ? "descriptionDivDM" :'descriptionDiv'}>
        {isVodja 
        ? 
        <div className="divProjectNameDescription">
        <Tooltip title="change project title">
          <h2 onClick={()=>handleClickOpen1()} style={{marginTop:"2%"}} className="h2EditProjectNameVodja">{props.ProjectName}</h2>
        </Tooltip>
        <Tooltip title="change project description" placement="bottom-start">
           <Typography onClick={()=>handleClickOpen2()} className="EditProjectDescriptionVodja" sx={{marginTop:"10px", marginLeft:"1%", width:"85%"}}>
          {props.ProjectDescription}
        </Typography>
        </Tooltip>
        </div>
        :
        <div className="divProjectNameDescription">
        <h2 style={{marginTop:"2%"}} className="h2EditProjectName">{props.ProjectName}</h2>
        <Typography className="EditProjectDescription" sx={{marginTop:"10px", marginLeft:"1%", width:"85%"}}>
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
            <div style={{marginLeft:"10%"}}>
             <ThemeProvider theme={theme}>
                      <TextField onChange={getProjectName} id="outlined-basic3"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white': "black"}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} label="New project title" variant="outlined" type="text" color="primary" sx ={{ maxWidth: "85%"  }}/>
              </ThemeProvider>
              </div>
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
            <div style={{marginLeft:"10%"}}>
             <ThemeProvider theme={theme}>
                      <TextField rows={"6"} multiline onChange={getProjectDescription} id="outlined-basic3"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white': "black"}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} label="New project description" variant="outlined" type="text" color="primary" sx ={{ width: "90%" }}/>
              </ThemeProvider>
              </div>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme}><Button onClick={handleClose2} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>changeProjectDescription()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Submit
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
    </div>
  );
}
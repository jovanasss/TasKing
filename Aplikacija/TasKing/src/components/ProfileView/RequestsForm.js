import React, { useState, useEffect }  from "react";
import '../../styles/ProfileView/RequestsForm.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from "@mui/system";
import Button from '@mui/material/Button';
import { createTheme , experimental_sx as sx} from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Store } from 'react-notifications-component';

const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

const theme = createTheme({
    components:{
      MuiButton: {styleOverrides:{
        root: {
         "&:hover": {
           backgroundColor: "rgb(31, 206, 206)",
         },
        }
       }}
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

  const theme1 = createTheme({
    palette: {
      primary: {
        main: "rgb(230, 0, 0)",
      },
      secondary:{
        main : "rgb(0, 100, 0)",
      }
    },
  })

  function RequestsForm(){

    const [teamRequests, setTeamRequests] = useState(null);
    const [organisationRequests, setOrganisationRequests] = useState(null);
    const [userID ,setUserID] = useState(null);

    useEffect(() =>{
      
      const user = (JSON.parse(window.localStorage.getItem('user-info')));
      fetch("https://localhost:5001/Korisnik/VratiIDKorisnika/"+user.value,
      {
          method:"GET",
          headers: {
              'Content-Type': 'application/json',
          },
      }).then(res => {
          res.json()
          .then(data => {
              setUserID(data[0].id);
          });
      })
        fetch("https://localhost:5001/Tim/VratiPoziveIzTima/"+ user.value,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            res.json()
            .then(data => {
                setTeamRequests(data);
            });
        })
    }, [])

    useEffect(() =>{
      const user = (JSON.parse(window.localStorage.getItem('user-info')));
        fetch("https://localhost:5001/Organizacija/VratiPoziveIzOrganizacije/"+user.value,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            res.json()
            .then(data => {
                setOrganisationRequests(data);
            });
        })
    }, [])

    return(
   <div className= "MaindivRequestsForm">
     {teamRequests && organisationRequests && userID && <RequestsForm1 teamRequests={teamRequests} organisationRequests={organisationRequests} userID={userID} />}
   </div>
       )
   }

function RequestsForm1({teamRequests, organisationRequests,userID}){

  const [teams, setTeams] = useState(teamRequests);
  const [organisations, setOrganisations] = useState(organisationRequests);

  function acceptInvitationforOrganisation(orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));

    const ClanOrganizacije = {
      idKorisnika : userID,
      idOrganizacije : orgID,
      admin : false
    }
    fetch("https://localhost:5001/Organizacija/PrihvatiPozivUOrganizaciju/"+user.value+"/"+orgID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/" + localStorage.getItem('user-info'),{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanOrganizacije)
    });
    Store.addNotification({
      title: "Success",
      message: "The invitation is successfully accepted 😀",
      type: "success",
      insert: "top",
      container: "top-center",
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
    //alert("The invitation is successfully accepted 😀");
    let o = organisations.filter(org => org.id != orgID);
    setOrganisations(o);
  }

  function acceptInvitationforTeam(timID, orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));



    const ClanOrganizacije = {
      idKorisnika : userID,
      idOrganizacije : orgID,
      admin : false
    }
  
    fetch("https://localhost:5001/Tim/PrihvatiPozivUTim/"+user.value+"/"+timID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
   fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/"+ localStorage.getItem('user-info'),{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanOrganizacije)
    }).then(res => {
      res.json()
      .then(data => {
       const ClanTima = {
        idClanaOrganizacije : data,
        idtima : timID,
        vodja : false
      }
    
      fetch("https://localhost:5001/Tim/UclaniUTim/"+ localStorage.getItem('user-info'),{
              method : 'POST',
              headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
              },
              body : JSON.stringify(ClanTima)
       });
      })
  })
  Store.addNotification({
    title: "Success",
    message: "The invitation is successfully accepted 😀",
    type: "success",
    insert: "top",
    container: "top-center",
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
    //alert("The invitation is successfully accepted 😀");
    let t = teams.filter(team => team.id != timID);
    setTeams(t);
  }

  function rejectInvitationforOrganisation(orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Organizacija/OdbijPozivUOrganizaciju/"+user.value+"/"+orgID,
    {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
    });
    Store.addNotification({
      title: "Information",
      message: "The invitation is rejected",
      type: "info",
      insert: "top",
      container: "top-center",
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
     //alert("The invitation is rejected");
     let o = organisations.filter(org => org.id != orgID);
     setOrganisations(o);
  }

  function rejectInvitationforTeam(timID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Tim/OdbijPozivUTim/"+user.value+"/"+timID,
    {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
    });
    Store.addNotification({
      title: "Information",
      message: "The invitation is rejected",
      type: "info",
      insert: "top",
      container: "top-center",
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
     //alert("The invitation is rejected");
     let t = teams.filter(team => team.id != timID);
     setTeams(t);
  }

 return(
<Grid container spacing={5}>
  <Grid item md={6} xs={12} sm={12}>
    <div className="levidivRequests">
    <div className="divPaperTeamRequests">
      <div className="divPaperTopLabelTeamRequests" style={{color : darkMode ? "white":"black"}}><h2>Teams</h2></div>
          <Paper className="PaperRequests" 
          sx={{
            borderStyle:"dotted", 
            borderWidth:"thick", 
            borderColor:"rgb(26, 150, 167)", 
            backgroundColor:"#d6e9de", 
            borderRadius:"20px", 
            boxShadow:" 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)"}}>
          <List>
          {teams.map(item => (
          <ListItem
           key={item.id}
           secondaryAction={
            <div>
            <IconButton sx={{marginRight:"1px"}} edge="end" aria-label="delete" onClick={()=>acceptInvitationforTeam(item.id,  item.organizacijaID)}>
              <ThemeProvider theme={theme}>
              <CheckIcon color="primary" />
              </ThemeProvider>
            </IconButton>
             <IconButton edge="end" aria-label="delete" onClick={()=>rejectInvitationforTeam(item.id)}>
              <ThemeProvider theme={theme1}>
             <CloseIcon color="primary" />
             </ThemeProvider>
           </IconButton>
           </div>
          }>
          <ListItemAvatar>
                    <Avatar  src={"../../profile/"+item.slika}>Team</Avatar> 
                  </ListItemAvatar>
          <ListItemText sx={{wordWrap:"break-word"}} primary={item.ime +" (" + item.organizacijaIme + ")"}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {new Date(item.vremepoziva).toDateString()}
              </Typography>
            </React.Fragment>
          }
        />
         </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    </div>
    </Grid>

    <Grid item md={6} xs={12} sm={12}>
    <div className="desnidivRequests">
    <div className="divPaperOrgRequests">
      <div className="divPaperTopLabelOrganisation" style={{color : darkMode ? "white" :"black"}} ><h2>Organisations</h2></div>
          <Paper className="PaperRequests" 
          sx={{
            borderStyle:"dotted", 
            borderWidth:"thick", 
            borderColor:"rgb(26, 150, 167)", 
            backgroundColor:"#d6e9de", 
            borderRadius:"20px", 
            boxShadow:" 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)" }}>
          <List>
          {organisations.map(item => (
          <ListItem
           key={item.id}
           secondaryAction={
            <div>
            <IconButton sx={{marginRight:"1px"}} edge="end" aria-label="delete" onClick={()=>acceptInvitationforOrganisation(item.id)}>
              <ThemeProvider theme={theme}>
              <CheckIcon color="primary"/>
              </ThemeProvider>
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={()=>rejectInvitationforOrganisation(item.id)}>
            <ThemeProvider theme={theme1}>
            <CloseIcon color="primary" />
            </ThemeProvider>
          </IconButton>
          </div>
          }>
            <ListItemAvatar>
                    <Avatar  src={"../../profile/"+item.slika}>Org</Avatar>
                  </ListItemAvatar>
          <ListItemText  sx={{wordWrap:"break-word"}} primary={item.ime} 
           secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {new Date(item.vremepoziva).toDateString()}
              </Typography>
            </React.Fragment>
          }
        />
         </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    </div> 
    </Grid>
    </Grid>   
    )
}

export default RequestsForm;
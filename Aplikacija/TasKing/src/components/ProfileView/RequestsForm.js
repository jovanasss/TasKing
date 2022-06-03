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

  function RequestsForm(){

    const [teamRequests, setTeamRequests] = useState(null);
    const [organisationRequests, setOrganisationRequests] = useState(null);

    useEffect(() =>{
      const user = (JSON.parse(window.localStorage.getItem('user-info')));
        fetch("https://localhost:5001/Tim/VratiPoziveIzTima/"+user.id,
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
        fetch("https://localhost:5001/Organizacija/VratiPoziveIzOrganizacije/"+user.id,
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
     {teamRequests && organisationRequests && <RequestsForm1 teamRequests={teamRequests} organisationRequests={organisationRequests} />}
   </div>
       )
   }

function RequestsForm1({teamRequests, organisationRequests}){

  function acceptInvitationforOrganisation(orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    const ClanOrganizacije = {
      idKorisnika : user.id,
      idOrganizacije : orgID,
      admin : false
    }
    fetch("https://localhost:5001/Organizacija/PrihvatiPozivUOrganizaciju/"+user.id+"/"+orgID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanOrganizacije)
    });

    alert("The invitation is successfully accepted 😀");
    
  }

  function acceptInvitationforTeam(timID, orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    const ClanOrganizacije = {
      idKorisnika : user.id,
      idOrganizacije : orgID,
      admin : false
    }
  
    fetch("https://localhost:5001/Tim/PrihvatiPozivUTim/"+user.id+"/"+timID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
   fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
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
    
      fetch("https://localhost:5001/Tim/UclaniUTim/",{
              method : 'POST',
              headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
              },
              body : JSON.stringify(ClanTima)
       });
      })
  })

    alert("The invitation is successfully accepted 😀");
  }

  function rejectInvitationforOrganisation(orgID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Organizacija/OdbijPozivUOrganizaciju/"+user.id+"/"+orgID,
    {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
    })
     alert("The invitation is rejected");
  }

  function rejectInvitationforTeam(timID){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Tim/OdbijPozivUTim/"+user.id+"/"+timID,
    {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
    })
     alert("The invitation is rejected");
  }

 return(
<Grid container  spacing={20}>
  <Grid item md={5} xs={12} sm={8}>
    <div className="levidivRequests">
    <div className="divPaperTeamRequests">
      <div className="divPaperTopLabelTeamRequests"><h2>Teams</h2></div>
          <Paper className="PaperRequests">
          <List>
          {teamRequests.map(item => (
          <ListItem
           key={item.id}
           secondaryAction={
            <div>
            <IconButton sx={{marginRight:"1px"}} edge="end" aria-label="delete" onClick={()=>acceptInvitationforTeam(item.id,  item.organizacijaID)}>
              <CheckIcon />
            </IconButton>
             <IconButton edge="end" aria-label="delete" onClick={()=>rejectInvitationforTeam(item.id)}>
             <CloseIcon />
           </IconButton>
           </div>
          }>
          <ListItemAvatar>
                    <Avatar>
                    </Avatar>
                  </ListItemAvatar>
          <ListItemText primary={item.ime}
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

    <Grid item md={5} xs={12} sm={8}>
    <div className="desnidivRequests">
    <div className="divPaperOrgRequests">
      <div className="divPaperTopLabelOrganisation"><h2>Organisations</h2></div>
          <Paper className="PaperRequests">
          <List>
          {organisationRequests.map(item => (
          <ListItem
           key={item.id}
           secondaryAction={
            <div>
            <IconButton sx={{marginRight:"1px"}} edge="end" aria-label="delete" onClick={()=>acceptInvitationforOrganisation(item.id)}>
              <CheckIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={()=>rejectInvitationforOrganisation(item.id)}>
            <CloseIcon />
          </IconButton>
          </div>
          }>
            <ListItemAvatar>
                    <Avatar>
                    </Avatar>
                  </ListItemAvatar>
          <ListItemText primary={item.ime} 
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
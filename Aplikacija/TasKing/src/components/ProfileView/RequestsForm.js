import React, { useState, useEffect }  from "react";
import '../../styles/ProfileView/RequestsForm.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from "@mui/system";
import Button from '@mui/material/Button';
import { createTheme , experimental_sx as sx} from "@mui/material/styles";
import Grid from '@mui/material/Grid';

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

 return(
<Grid container  spacing={20}>
  <Grid item md={5} xs={12} sm={8}>
    <div className="levidivRequests">
     <PaperListTeamRequests teamRequests={teamRequests} />
    </div>
    </Grid>

    <Grid item md={5} xs={12} sm={8}>
    <div className="desnidivRequests">
    <PaperListOrganisationRequests organisationRequests={organisationRequests} />
    </div> 
    </Grid>
    </Grid>   
    )
}

  function PaperListTeamRequests({teamRequests}){

    return(
    <div className="divPaperTeamRequests">
      <div className="divPaperTopLabelTeamRequests"><h2>Teams</h2></div>
          <Paper className="PaperRequests">
          <List>
          {teamRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.slika}</ListItemIcon>
          <ListItemText primary={item.ime}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.vremepoziva}
              </Typography>
            </React.Fragment>
          }
        />
         </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    )
  }
  
  function PaperListOrganisationRequests({organisationRequests}){
    
    return(
    <div className="divPaperOrgRequests">
      <div className="divPaperTopLabelOrganisation"><h2>Organisations</h2></div>
          <Paper className="PaperRequests">
          <List>
          {organisationRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.slika}</ListItemIcon>
          <ListItemText primary={item.ime} 
           secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.vremepoziva}
              </Typography>
            </React.Fragment>
          }
        />
         </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    )
  }

export default RequestsForm;
import React, { useState }  from "react";
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

  const teamSentRequests = [
    {
      id: 1,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id: 2,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id: 3,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    }
  ]

  const teamReceivedRequests = [
    {
      id: 1,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id: 2,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id: 3,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Stump",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    }
  ]

  const organisationSentRequests = [
    {
      id:1,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:2,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:3,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "to",
      status: "active"
    }
  ]

  const organisationReceivedRequests = [
    {
      id:1,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:2,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:3,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Elfak",
      vremepoziva: "datetime",
      from: "from",
      status: "active"
    }
  ]

function RequestsForm(){

 const [active1, setActive1] = useState("TeamSentRequests");
 const [active2, setActive2] = useState("OrganisationSentRequests");

 return(
<div className= "MaindivRequestsForm">

<Grid container  spacing={20}>
  <Grid item md={5} xs={12} sm={8}>
    <div className="levidivRequests">
    {active1 === "TeamSentRequests" && <PaperListTeamSentRequests />}
    {active1 === "TeamReceivedRequests" && <PaperListTeamReceivedRequests />}
   

        <div className="divButtonSentReceive">
                  <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"18%"}}
                   variant="contained"
                   onClick={() => setActive1("TeamSentRequests")}>
                   Sent
                 </Button>
                 </ThemeProvider></div>
                 <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"12%", marginLeft:"2%"}}
                   variant="contained"
                   onClick={() => setActive1("TeamReceivedRequests")}>
                   Received
                 </Button>
                 </ThemeProvider></div>
            </div>
    </div>
    </Grid>

    <Grid item md={5} xs={12} sm={8}>
    <div className="desnidivRequests">
    {active2 === "OrganisationSentRequests" && <PaperListOrganisationSentRequests />}
    {active2 === "OrganisationReceivedRequests" && <PaperListOrganisationReceivedRequests />}
          <div className="divButtonSentReceive">
                  <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"18%"}}
                   variant="contained"
                   onClick={() => setActive2("OrganisationSentRequests")}>
                   Sent
                 </Button>
                 </ThemeProvider></div>
                 <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"12%", marginLeft:"2%"}}
                   variant="contained"
                   onClick={() => setActive2("OrganisationReceivedRequests")}>
                   Received
                 </Button>
                 </ThemeProvider></div>
            </div>
    </div> 
    </Grid>
    </Grid>   
</div>
    )
}

function PaperListTeamSentRequests(){
    return(
    <div className="divPaperTeamRequests">
      <div className="divPaperTopLabelTeamRequests"><h2>Teams (Sent)</h2></div>
          <Paper className="PaperRequests">
          <List>
          {teamSentRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.photo}</ListItemIcon>
          <ListItemText primary={item.name}
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
              <br />
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.from}
              </Typography>
              <br />
              {item.status}
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

  function PaperListTeamReceivedRequests(){
    return(
    <div className="divPaperTeamRequests">
      <div className="divPaperTopLabelTeamRequests"><h2>Teams (Received)</h2></div>
          <Paper className="PaperRequests">
          <List>
          {teamReceivedRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.photo}</ListItemIcon>
          <ListItemText primary={item.name}
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
              <br />
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.from}
              </Typography>
              <br />
              {item.status}
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
  
  function PaperListOrganisationSentRequests(){
    return(
    <div className="divPaperOrgRequests">
      <div className="divPaperTopLabelOrganisation"><h2>Organisations (Sent)</h2></div>
          <Paper className="PaperRequests">
          <List>
          {organisationSentRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.photo}</ListItemIcon>
          <ListItemText primary={item.name} 
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
              <br />
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.from}
              </Typography>
              <br />
              {item.status}
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

  function PaperListOrganisationReceivedRequests(){
    return(
    <div className="divPaperOrgRequests">
      <div className="divPaperTopLabelOrganisation"><h2>Organisations (Received)</h2></div>
          <Paper className="PaperRequests">
          <List>
          {organisationReceivedRequests.map(item => (
          <ListItem
           key={item.id}
           button
          >
          <ListItemIcon>{item.photo}</ListItemIcon>
          <ListItemText primary={item.name} 
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
              <br />
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {item.from}
              </Typography>
              <br />
              {item.status}
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
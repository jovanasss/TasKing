import React, { useState, useEffect } from "react";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles";
import { ListItemSecondaryAction, TextField } from "@mui/material";
import '../../styles/ProfileView/EditAccountForm.css';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

const theme = createTheme({
  components:{
    MuiTextField : {styleOverrides:{
        root : sx ({
          "& .MuiOutlinedInput-root": {
              "& > fieldset": {
                borderColor: "rgb(0, 100, 100)",
              },
          ":hover"  :{
              "& > fieldset": {
                  borderColor: "rgb(0, 100, 100)",
                },
          }  
          }
        })
    }},  
    MuiButton: {styleOverrides:{
      root: {
       "&:hover": {
         backgroundColor: "rgb(31, 206, 206)",
       },
      }
     }},
     MuiAvatar: {styleOverrides:{
      root: {
       "&:hover": {
         backgroundColor: "rgb(31, 206, 206)",
         cursor: "pointer"
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

function EditAccountForm(){

    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [organisations, setOrganisations] = useState([]);

  useEffect(() =>{
    fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+1,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
        res.json()
        .then(data => {
            setUser(data);
        });
    })
}, [])

    useEffect(() => {
        fetch("https://localhost:5001/Organizacija/VratiOrganizacijeKorisnika/" + 1,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                res.json()
                    .then(data => {
                        setOrganisations(data);
                    });
            })
    }, [])

    useEffect(() => {
        fetch("https://localhost:5001/Tim/VratiTimoveKorisnika/" + 1,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                res.json()
                    .then(data => {
                        setTeams(data);
                    });
            })
    }, [])

  return(
    <div className="divMainEditAccount">
          {user && teams && organisations && <EditAccountForm1 user={user} organisations={organisations} teams={teams} />}
    </div>
  )
}

function EditAccountForm1({user, organisations, teams}){

    const [open, setOpen] = useState(false);

          const handleClickOpen = () => {
            setOpen(true);
          };
        
          const handleClose = () => {
            setOpen(false);
          };

          const [active, setActive] = useState("TeamList");

        return (
              <Grid container>
                <Grid item md={4} xs={12} sm={12}>
                    <div className="LeviDivEditAccount">
                        <div className="divInputFirstName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].ime} variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }} disabled/>
                                </ThemeProvider>
                        </div>

                        <div className="divInputLastName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].prezime} variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                       <div className="DivEditUserName"> 
                        <div className="divInputUserName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" label="Username" value={user[0].korisnickoIme} variant="outlined" type="text" color="primary" sx ={{ width: "85%"  }}/>
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained">Edit</Button>
                        </ThemeProvider>
                       </div> 

                        <div className="divInputEmail">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].email} variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                        <div className="DivEditPhone"> 
                        <div className="divInputPhone">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" label="Phone Number" value={user[0].brtelefona} variant="outlined" type="number" color="primary" sx ={{ width: "85%"  }}/> 
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained">Edit</Button>
                        </ThemeProvider>
                        </div>
                        </div>
                      </Grid>

                     <Grid item md={3} xs={12} sm={6}>
                      <div className="DivButtonChangePassword">
                        <ThemeProvider theme={theme}>
                           <Button 
                           onClick={handleClickOpen} 
                           variant="contained"
                           sx={{height:"80px", width: "190px", border:"2px solid black", borderRadius:"10px", marginTop:"20%", marginLeft:"21%"}}
                           color="primary">
                             Change password
                          </Button>
                          </ThemeProvider>
                           <Dialog open={open} onClose={handleClose}>
                             <DialogTitle>Update your password</DialogTitle>
                             <DialogContent>
                            <DialogContentText>
                             Enter your current password and a new password.
                           </DialogContentText>
                         <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Current Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                       </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleClose}>Done</Button>
                    </DialogActions>
                    </Dialog>
                  </div>
                </Grid>

              <Grid item md={3} xs={8} sm={4}>
                <div className="DesniDivEditAccount">
                  <div className="divAvatarEditAccount">
                            <ThemeProvider theme={theme}>
                            <Tooltip title={<h1 style={{color:"rgb(31, 206, 206)"}}>Click to change photo</h1>} placement="top" sx={{fontSize:"20px"}}>
                            <Avatar sx={{width: "150px", height:"150px"}} onClick={()=> alert("change photo")}></Avatar>
                            </Tooltip>
                            </ThemeProvider>
                  </div>

                        {active === "TeamList" && <PaperListTeams teams={teams} />}
                        {active === "OrganisationList" && <PaperListOrganisations organisations={organisations} />}

              <div className="divButtonSee">
                  <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"12%", marginRight:"1%"}}
                   variant="contained"
                   onClick={() => setActive("OrganisationList")}>
                   See organisations
                 </Button>
                 </ThemeProvider></div>
                 <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"19%"}}
                   variant="contained"
                   onClick={() => setActive("TeamList")}>
                   See teams
                 </Button>
                 </ThemeProvider></div>
            </div>
                </div>
                </Grid>
            </Grid>
        )
}

function PaperListTeams({ teams }){

  /*const teams = [
    {
      id: 1,
      photo: <Avatar></Avatar>,
      name: "Stump"
    },
    {
      id: 2,
      photo: <Avatar></Avatar>,
      name: "Stump"
    },
    {
      id: 3,
      photo: <Avatar></Avatar>,
      name: "Stump"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Stump"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Stump"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Stump"
    }
  ]*/

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelTeam"><h2>Teams</h2></div>
        <Paper className="PaperEditAccount">
        <List>
        {teams.map(item => (
        <ListItem
         key={item.id}
         button
        >
        <ListItemIcon>{item.slika}</ListItemIcon>
        <ListItemText primary={item.ime} />
       </ListItem>
         ))}
      </List>
    </Paper>
  </div>
  )
}

function PaperListOrganisations({ organisations }){

  /*const organisations = [
    {
      id:1,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    },
    {
      id:2,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    },
    {
      id:3,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    },
    {
      id:4,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    },
    {
      id:5,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    },
    {
      id:6,
      photo: <Avatar></Avatar>,
      name: "Elfak"
    }
  ]*/

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelOrganisation"><h2>Organisations</h2></div>
        <Paper className="PaperEditAccount">
        <List>
        {organisations.map(item => (
        <ListItem
         key={item.id}
         button
        >
        <ListItemIcon>{item.slika}</ListItemIcon>
        <ListItemText primary={item.ime} />
       </ListItem>
         ))}
      </List>
    </Paper>
  </div>
  )
}

export default EditAccountForm;
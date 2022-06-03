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
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Grid from '@mui/material/Grid';
import ClearIcon from '@mui/icons-material/Clear';
import { ListItemButton } from "@mui/material";
import IconButton from '@mui/material/IconButton';

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

function EditAccountForm(){

    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState(null);
    const [organisations, setOrganisations] = useState(null);
    const teams1 = [];
    const idclanova = [];

  useEffect(() =>{
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+user.id,
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
      const user = (JSON.parse(window.localStorage.getItem('user-info')));
        fetch("https://localhost:5001/Organizacija/VratiOrganizacijeKorisnika/" + user.id,
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
      const user = (JSON.parse(window.localStorage.getItem('user-info')));
        fetch("https://localhost:5001/Korisnik/VratiIDClanovaOrganizacije/" + user.id,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                res.json()
                    .then(data => {
                        data.forEach(d =>{
                          idclanova.push(d);
                        })
                        {idclanova.map(clanid => {
                          fetch("https://localhost:5001/Tim/VratiTimoveKorisnika/" + clanid.id,
                        {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(res => {
                            res.json()
                                .then(data => {
                                    data.forEach(d =>{
                                      teams1.push(d);
                                    })
                                });
                        })
                        })}
                        setTeams(teams1);
                        })
                    });
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

        const [active, setActive] = useState("OrganisationList");
         
        const [username, setUsername] = useState(null);
        const [phone, setPhone] = useState(null);
        const [currentpass, setCurrenpass] = useState(null);
        const [newpass, setNewpass] = useState(null);
        const [confirmnewpass, setConfirmnewpass] = useState(null);

        function getUsername(e){
          setUsername(e.target.value);
          console.log(username);
        }

        function getPhone(e){
          setPhone(e.target.value);
        }

        function getCurrentpass(e){
          setCurrenpass(e.target.value);
        }

        function getNewpass(e){
          setNewpass(e.target.value);
        }

        function getConfirmnewpass(e){
          setConfirmnewpass(e.target.value);
        }

        function changeUsername(){
          const user = (JSON.parse(window.localStorage.getItem('user-info')));
          if(username == null){
            alert("The field username must be filled in!");
            return
          }

          if(username.length == 0){
            alert("The field username must be filled in!");
            return
          }

          if(username === user.korisnickoIme){
            alert("This is already a username!");
            return
          }

          fetch("https://localhost:5001/Korisnik/PromeniUsernameKorisniku/"+user.id+"/"+username,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
          })
           alert("Username is successfully changed 😀");
           return
        }

        function changePhone(){
          if(phone == null){
            alert("The field phone number must be filled in!");
            return
          }

          if(phone.length == 0){
            alert("The field phone number must be filled in!");
            return
          }

          const user = (JSON.parse(window.localStorage.getItem('user-info')));
          fetch("https://localhost:5001/Korisnik/PromeniBrTelefonaKorisniku/"+user.id+"/"+phone,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
          })
          alert("Phone number is successfully changed 😀");
          return
        }

        function changePassword(){
          const user = (JSON.parse(window.localStorage.getItem('user-info')));

          if(currentpass == null){
            alert("The field current password must be filled in!");
            return
          }
          if(newpass == null){
            alert("The field new password must be filled in!");
            return
          }
          if(confirmnewpass == null){
            alert("The field confirm new password must be filled in!");
            return
          }

          if(currentpass.length == 0){
            alert("The field current password must be filled in!");
            return
          }
          if(newpass.length == 0){
            alert("The field new password must be filled in!");
            return
          }
          if(confirmnewpass.length == 0){
            alert("The field confirm new password must be filled in!");
            return
          }

          if(currentpass !== user.lozinka){
            alert("Wrong current password!");
            return
          }

          if(newpass !== confirmnewpass){
            alert("New password and confirm new password are not the same!");
            return;
          }

          if(newpass == confirmnewpass == currentpass){
            alert("This is already a password!");
            return;
          }

          fetch("https://localhost:5001/Korisnik/PromeniPasswordKorisniku/"+user.id+"/"+currentpass+"/"+newpass+"/"+confirmnewpass,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
          })
          alert("Password is successfully changed 😀");
          return
        }

        return (
              <Grid container>
                <Grid item md={4} xs={12} sm={12}>
                    <div className="LeviDivEditAccount">
                        <div className="divInputFirstName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].ime} variant="outlined" type="text" color="primary" required sx ={{ maxWidth: "85%"  }} disabled/>
                                </ThemeProvider>
                        </div>

                        <div className="divInputLastName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].prezime} variant="outlined" type="email" color="primary" required sx ={{ maxWidth: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                       <div className="DivEditUserName"> 
                        <div className="divInputUserName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" defaultValue={user[0].korisnickoIme} onChange={getUsername} label="Username" variant="outlined" type="text" color="primary" sx ={{ maxWidth: "85%"  }}/>
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained"
                        onClick={changeUsername}
                        >Edit</Button>
                        </ThemeProvider>
                       </div> 

                        <div className="divInputEmail">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value={user[0].email} variant="outlined" type="email" color="primary" required sx ={{ maxWidth: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                        <div className="DivEditPhone"> 
                        <div className="divInputPhone">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" defaultValue={user[0].brtelefona} onChange={getPhone} label="Phone Number" variant="outlined" type="number" color="primary" sx ={{ maxWidth: "85%"  }}/> 
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained"
                        onClick={changePhone}
                        >Edit</Button>
                        </ThemeProvider>
                        </div>
                        </div>
                      </Grid>

                     <Grid item md={3} xs={12} sm={12}>
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
                          <ThemeProvider theme={theme}>
                         <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Current Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getCurrentpass}
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getNewpass}
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getConfirmnewpass}
                          />
                          </ThemeProvider>
                       </DialogContent>
                      <DialogActions>
                     <ThemeProvider theme={theme}><Button color="primary" onClick={handleClose}>Cancel</Button></ThemeProvider>
                     <ThemeProvider theme={theme}><Button variant="contained" onClick={changePassword}>Done</Button></ThemeProvider>
                    </DialogActions>
                    </Dialog>
                  </div>
                </Grid>

              <Grid item md={3} xs={6} sm={6}>
                <div className="DesniDivEditAccount">
                  <div className="divAvatarEditAccount">
                            <ThemeProvider theme={theme}>
                            <Tooltip title={<h1 style={{color:"rgb(31, 206, 206)"}}>Click to change photo</h1>} placement="top" sx={{fontSize:"20px"}}>
                            <Avatar sx={{width: "150px", height:"150px"}}></Avatar>
                            </Tooltip>
                            </ThemeProvider>
                  </div>

                        {active === "TeamList" && <PaperListTeams teams={teams} />}
                        {active === "OrganisationList" && <PaperListOrganisations organisations={organisations} />}

              <div className="divButtonSee">
                  <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"8%", marginRight:"5%", height:"70px", minWidth:"150px"}}
                   variant="contained"
                   onClick={() => setActive("OrganisationList")}>
                   See organisations
                 </Button>
                 </ThemeProvider></div>
                 <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"12%", height:"70px", minWidth:"100px"}}
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

  const [open, setOpen] = useState(false);
  const [orgID, setOrgID] = useState(false);
  const [timID, setTimID] = useState(false);

  const handleClickOpen = (orgID, timID) => {
    setOpen(true);
    setOrgID(orgID);
    setTimID(timID);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function leaveTeam(){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Organizacija/VratiIDClanaOrganizacije/"+user.id+"/"+orgID,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
        res.json()
        .then(data => {
          fetch("https://localhost:5001/Tim/IzbaciKorisnikaIzTima/"+timID+"/"+data,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
          })
          alert("You left the team");
          handleClose();
        });
    })
  }

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelTeam"><h2>Teams</h2></div>
        <Paper className="PaperEditAccount"  sx={{backgroundColor:"#d6e9de"}}>
        <List>
        {teams.map(item => (
        <ListItem
         key={item.id}
         secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={()=>handleClickOpen(item.organizacijaID, item.id)}>
          <ThemeProvider theme={theme1}>
          <ClearIcon color="primary" />
          </ThemeProvider>
        </IconButton>
        }
        >
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.ime} />
       </ListItem>
         ))}
      </List>
    </Paper>
    <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold"}}>
                {"Leave team"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to leave?
              </DialogContentText>
            </DialogContent>
              <DialogActions>
                 <ThemeProvider theme={theme}><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>leaveTeam()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Leave
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
  </div>
  )
}

function PaperListOrganisations({ organisations }){

  const [open, setOpen] = useState(false);
  const [orgID, setOrgID] = useState(false);

  const handleClickOpen = (orgid) => {
    setOpen(true);
    setOrgID(orgid);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function leaveOrganisation(){
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    fetch("https://localhost:5001/Organizacija/IzbaciKorisnikaIzOrganizacije/"+user.id+"/"+orgID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    alert("You left the organisation");
    handleClose();
  }

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelOrganisation"><h2>Organisations</h2></div>
        <Paper className="PaperEditAccount"  sx={{backgroundColor:"#d6e9de"}}>
        <List>
        {organisations.map(item => (
        <ListItem
        key={item.id}
        secondaryAction={
         <IconButton edge="end" aria-label="delete" onClick={()=>handleClickOpen(item.id)}>
          <ThemeProvider theme={theme1}>
         <ClearIcon color="primary" />
         </ThemeProvider>
       </IconButton>
       }
       >
       <ListItemAvatar>
         <Avatar></Avatar>
       </ListItemAvatar>
       <ListItemText primary={item.ime} />
      </ListItem>
        ))}
     </List>
   </Paper>
   <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold"}}>
                {"Leave organisation"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to leave?
              </DialogContentText>
            </DialogContent>
              <DialogActions>
                 <ThemeProvider theme={theme}><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme}>
                   <Button onClick={()=>leaveOrganisation()} variant="contained" color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Leave
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
  </div>
  )
}

export default EditAccountForm;
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
import { Switch } from "@mui/material";
import { pink } from "@mui/material/colors";

const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

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
    const [teamsfirst, setTeamsfirst] = useState(null);
    const [organisationsfirst, setOrganisationsfirst] = useState(null);
    const teams1 = [];
    const idclanova = [];

    const [darkMode ,setDarkMode] = useState((JSON.parse(window.localStorage.getItem('darkMode'))));
    document.body.style.backgroundColor = darkMode ? "rgb(46, 45, 45)" :"azure";

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
                        setOrganisationsfirst(data);
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
                        setTeamsfirst(teams1);
                      })
                  });
    }, [])

  return(
    <div className="divMainEditAccount">
          {user && teamsfirst && organisationsfirst && <EditAccountForm1 user={user} organisationsfirst={organisationsfirst} teamsfirst={teamsfirst} />}
    </div>
  )
}

function EditAccountForm1({user, organisationsfirst, teamsfirst}){

    const [open, setOpen] = useState(false);
    const [teams, setTeams] = useState(teamsfirst);
    const [organisations, setOrganisations] = useState(organisationsfirst);
    const teamsFirst = [];
    const idclanova1 = [];

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

        function changeSeeOrganisations(){
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
                          setActive("OrganisationList");
                      });
              })
        }

        function changeSeeTeams(){
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
                          idclanova1.push(d);
                        })
                        {idclanova1.map(clanid => {
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
                                      teamsFirst.push(d);
                                    })
                                });
                            })
                        })}
                        setTeams(teamsFirst);
                      })
                      setActive("TeamList");
                  });
        }

        const hiddenFileInput = React.useRef(null);

        const handleClickFile = event => {
          hiddenFileInput.current.click();
        };

       const handleChangeFile = event => {
          const fileUploaded = event.target.files[0];

          const user = (JSON.parse(window.localStorage.getItem('user-info')));
          fetch("https://localhost:5001/Korisnik/PromeniSlikuKorisniku/"+user.id+"/"+fileUploaded.name,
          {
              method:"PUT",
              headers:{
                  "Content-Type":"application/json"
              },
          })
          alert("Photo is successfully changed 😀")
          window.location.reload(false);
        }

        return (
              <Grid container>
                <Grid item md={4} xs={12} sm={12}>
                    <div className="LeviDivEditAccount">
                        <div className="divInputFirstName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic1" InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} value={user[0].ime} variant="outlined" type="text" color="primary" required sx ={{ maxWidth: "85%"  }} disabled/>
                                </ThemeProvider>
                        </div>

                        <div className="divInputLastName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic2" inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} value={user[0].prezime} variant="outlined"  type="text" color="primary" required sx ={{ maxWidth: "85%"}} disabled /> 
                                </ThemeProvider>
                        </div>

                       <div className="DivEditUserName"> 
                        <div className="divInputUserName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic3"  inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white': "black"}}} defaultValue={user[0].korisnickoIme}  InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} onChange={getUsername} label="Username" variant="outlined" type="text" color="primary" sx ={{ maxWidth: "85%"  }}/>
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
                                    <TextField id="outlined-basic4" InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} value={user[0].email} variant="outlined" type="email" color="primary" required sx ={{ maxWidth: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                        <div className="DivEditPhone"> 
                        <div className="divInputPhone">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic5" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} defaultValue={user[0].brtelefona} onChange={getPhone} label="Phone Number" InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="number" color="primary" sx ={{ maxWidth: "85%"  }}/> 
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
                             <DialogTitle style={{
                              backgroundColor : darkMode ? "rgb(26,25,25)":"azure",
                              color : darkMode ? "white" :"black" ,
                             }} >Update your password</DialogTitle>
                             <DialogContent style={{
                              backgroundColor : darkMode ? "rgb(26,25,25)":"azure",
                              color : darkMode ? "white" :"black" ,
                             }}>
                            <DialogContentText style={{
                              color : darkMode ? "gray" :"black",
                            }}>
                             Enter your current password and a new password.
                           </DialogContentText>
                          <ThemeProvider theme={theme}>
                         <TextField
                          autoFocus
                          margin="dense"
                          id="name1"
                          label="Current Password"
                          inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}}
                          InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getCurrentpass}
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name2"
                          label="New Password"
                          inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}}
                          InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getNewpass}
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name3"
                          label="Confirm New Password"
                          inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}}
                          InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}
                          type="password"
                          fullWidth
                          variant="standard"
                          onChange={getConfirmnewpass}
                          />
                          </ThemeProvider>
                       </DialogContent>
                      <DialogActions style={{
                        backgroundColor : darkMode ? "rgb(26,25,25)": "azure",
                      }}>
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
                            <Avatar onClick={handleClickFile} sx={{width: "150px", height:"150px", fontSize:"60px"}} src={"../../profile/"+user[0].profilnaSlika}>
                            {user[0].ime.charAt(0)}{user[0].prezime.charAt(0)}
                            </Avatar>
                            </Tooltip>
                            </ThemeProvider>
                            <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />
                            <ThemeProvider theme={theme}>
                            <Switch sx={{marginLeft:"23%"}} checked = {darkMode} onChange={() => {localStorage.setItem('darkMode',!darkMode); window.location.reload(false);}} />
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
                   onClick={() => changeSeeOrganisations()}>
                   See organisations
                 </Button>
                 </ThemeProvider></div>
                 <div>
                  <ThemeProvider theme={theme}>
                  <Button 
                   sx={{border:"2px solid black", borderRadius:"10px", marginTop:"12%", height:"70px", minWidth:"100px"}}
                   variant="contained"
                   onClick={() => changeSeeTeams()}>
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

  const [teams1, setTeams1] = useState(teams);
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
          let t = teams1.filter(team => team.id != timID);
          setTeams1(t);
          handleClose();
        });
    })
  }

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelTeam" style={{ color : darkMode ? "white" : "black"}} ><h2>Teams</h2></div>
        <Paper className="PaperEditAccount"  sx={{backgroundColor:"#d6e9de"}}>
        <List>
        {teams1.map(item => (
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
          <Avatar src={"../../TandO/"+item.slika}>Team</Avatar>
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
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" ,backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Leave team"}
              </DialogTitle>
              <DialogContent style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
              <DialogContentText id="alert-dialog-description" style={{ color : darkMode ? "white" : "black"}}>
                Are you sure you want to leave?
              </DialogContentText>
            </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
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

  const [organisations1, setOrganisations1] = useState(organisations);
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
    let o = organisations1.filter(org => org.id != orgID);
    setOrganisations1(o);
    handleClose();
  }

  return(
  <div className="divPaperEditAccount">
    <div className="divPaperTopLabelOrganisation" style={{ color: darkMode ? "white" : "black" }}><h2>Organisations</h2></div>
        <Paper className="PaperEditAccount"  sx={{backgroundColor:"#d6e9de"}}>
        <List>
        {organisations1.map(item => (
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
         <Avatar  src={"../../TandO/"+item.slika}>Org</Avatar>
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
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" , backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Leave organisation"}
              </DialogTitle>
              <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
              <DialogContentText id="alert-dialog-description" style={{ color : darkMode ? "white"  : "black"}}>
                Are you sure you want to leave?
              </DialogContentText>
            </DialogContent>
              <DialogActions style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
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
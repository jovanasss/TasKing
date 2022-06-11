import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/TeamsMenu.css';
import { Avatar, Button, createTheme, Icon, IconButton, List, ListItem, ListItemIcon, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControlLabel, TextField , Box, Dialog, DialogTitle , DialogContent ,DialogContentText,DialogActions } from "@mui/material";
import { Autorenew, SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import ProjectMenu from './ProjectMenu';
import PropTypes from 'prop-types';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240
const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

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
  const [userName , setUserName] = useState('')
  const [userError , setUserError] = useState(false)

  async function handleInvite(){

    // error ako je neki input prazan
    if ( userName === ''){
      setUserError(true)
    }

     // oba imaju vrednost => logovanje 
    if (userName){

      const idOrg = (JSON.parse(window.localStorage.getItem('OrgID')));
      console.log(idOrg);

      fetch("https://localhost:5001/Organizacija/PozoviUOrganizaciju/" + userName + "/" + idOrg, {
        method: "POST"
        }).then(res =>{
          if(res.ok)
            {
              alert("zahtev je uspesno poslat");
            }
            else
            {
              res.json().then(data => {
                  if(data==1)
                  alert("korisnik ne postoji");

                  if(data==2)
                  alert("organizacija ne postoji");

                  if(data==3)
                  alert("zahtev je vec poslat");

                  if(data==4)
                  alert("korisnik je vec clan organizacije");
              });
            }
        })
    }
  }

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleRemove = (clanID) => {
    fetch("https://localhost:5001/Organizacija/IzbaciClana/" + clanID,
          {
              method: "PUT"
          }).then(s =>{
              if(s.ok)
              {
                 //alert("uspesno je izbacen clan");
                 if(props.clanID==-1)
                    return;

                  fetch("https://localhost:5001/Organizacija/VratiClanoveOrganizacije/" + props.clanID,
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
                      });
                    }
                    else
                    {
                      alert("uneli ste pogresno korisnicko ime ili lozinku");
                    }
                  })
              }
          });
  };

  let navigate = useNavigate();
  // promena strane
  const visitProfile = (korisnikID) =>{ 
    let path = `/Profile`; 
    localStorage.setItem('ProfileUser-info', korisnikID)
    navigate(path);
  }

  React.useEffect(() => {
    if(props.clanID==-1)
      return;

    fetch("https://localhost:5001/Organizacija/VratiClanoveOrganizacije/" + props.clanID,
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
      });
    }
    else
    {
      alert("uneli ste pogresno korisnicko ime ili lozinku");
    }
  })
 }, [props.clanID]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle style={{
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white": "black",
      }}>Members</DialogTitle>
      <div style={{marginBottom: '30px', display: props.vodjaStatus? 'inile' : 'none'}}>
      <TextField onChange={ (e) => setUserName(e.target.value) }
                  sx= {{marginLeft: '50px'}}  error={userError} id="outlined-basic" label="Username" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary"/>
      <ThemeProvider theme={theme}>
      <Button sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', marginTop: '5px'}}
       onClick={() => handleInvite()}>
        Invite
      </Button>
      </ThemeProvider>
      </div>
      <List sx={{ 
        pt: 0 ,
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white" : "black",
        }}>
        {members.filter(member => member.korisnik.id!=JSON.parse(window.localStorage.getItem('user-info')).id).map((member) => (
          <ListItem key={member.clanOrgID}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme} />
            <ThemeProvider theme={theme}>
              <Button
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}
                onClick={() => visitProfile(member.korisnik.id)}>
                View Profile
              </Button>
              <Button
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', display: props.vodjaStatus? 'inile' : 'none'}}
              onClick={()=>handleRemove(member.clanOrgID)}>
                 Remove
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


export default function TeamsMenu(props){

  const [openD, setOpenD] = useState(false)
  const [teams, setTeams] = useState([])
  const [teamName ,setTeamName] = useState('')
  const [teamError ,setTeamError] = useState(false)
  const [openSimple, setOpenSimple] = React.useState(false);

  const handleClickOpenSimple = () => {
    setOpenSimple(true);
  };

  const handleCloseSimple = (value) => {
    setOpenSimple(false);
  };

  const handleSeeMembers = (memberID) => {
    handleClickOpenSimple();
  };

  const showTeams = ()=>{

    setPrevOrg(props.clanID);

    if(props.clanID==-1)
    {
      setTeams([])
      setTim(-1)
      setClanTima(-1)
      //localStorage.setItem('TimID',-1)
      //localStorage.setItem('clanTimaID',-1)
      setVodja(false)
      return;
    }
    fetch("https://localhost:5001/Organizacija/VratiClanoveTima/" + props.clanID,
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
          setTeams(data)
          if(data==undefined || data==null)
          {
            setTim(-1)
            setClanTima(-1)
            localStorage.setItem('TimID',-1)
            localStorage.setItem('clanTimaID',-1)
            setVodja(false)
            return;
          }
         
          if(data.length==0)
          {
            setTim(-2)
            setClanTima(-2)
            localStorage.setItem('TimID',-2)
            localStorage.setItem('clanTimaID',-2)
            setVodja(false)
            return;
          }
          if(prevOrg==-1)
          {
            if(window.localStorage.getItem("TimID") === null)
            {
              setTim(data[0].idTima)
              setClanTima(data[0].idClan) 
              localStorage.setItem('TimID',data[0].idTima)
              localStorage.setItem('clanTimaID',data[0].idClan)
            }
            else
            {
              setTim(window.localStorage.getItem('TimID')) 
              setClanTima(window.localStorage.getItem('clanTimaID')) 
            }
          }
          else
          {
            setTim(data[0].idTima)
            setClanTima(data[0].idClan) 
            localStorage.setItem('TimID',data[0].idTima)
            localStorage.setItem('clanTimaID',data[0].idClan)
          }
          for(let i=0; i< data.length; i++)
          {
            if(data[i].idTima==window.localStorage.getItem('TimID'))
              {
                setVodja(data[i].vodja)
                break;
              }
          }
          //setVodja(data[0].vodja)
        });
      }
      else
      {
        alert("");
      }
    })
  }

  useEffect(() => {
    showTeams();
  }, [props.clanID]);


  async function addTeam() {

    
    const idClanaOrg = (JSON.parse(window.localStorage.getItem('clanOrgID')));
    console.log(idClanaOrg);

    let result = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijuClana/" +idClanaOrg, {
      method : 'GET',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
    });
    let statusOrg = result.status;
    result = await result.json();
    let idNoveOrg = result ;


    const tim = {
      ime : teamName ,
      idOrganizacije : idNoveOrg,
      
    }
    console.log(tim);


    let proveraTima = await fetch("https://localhost:5001/Tim/VratiTimIME/"+teamName , {
      method : 'GET',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
    });
    proveraTima = await proveraTima.json();
    console.log("Vrati tim :" ,proveraTima);
    if (proveraTima === 0){
      setOpenD(false)
      let rezultat = await fetch("https://localhost:5001/Tim/KreirajTim/", {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
        body : JSON.stringify(tim)
      });
  
  
      let statusT = rezultat.status;
      rezultat = await rezultat.json();
      let idNovogTima = rezultat ;
      console.log("ID novog tima :" ,idNovogTima);
      const vodja = true ;
      //result  = await result.json();
      console.log(statusT);
      
  
        const ClanTima = {
          idClanaOrganizacije : idClanaOrg,
          idtima : idNovogTima,
          vodja : vodja
        }
        console.log(ClanTima);
  
        let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/",{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
          body : JSON.stringify(ClanTima)
        });
        //localStorage.setItem('TimID', idNovogTima)
        //localStorage.setItem('clanTimaID',data[0].idClan)

        window.location.reload(false);
    }
    else{
      alert("Tim sa unetim imenom vec postoji !");
      setTeamError(true);  
    }


  }
  // otvaranje i zatvaranje Dijaloga 
  const handleClick = () => {
      console.log("Otvoren dijalog")
      setOpenD(true);
      setTeamError(false);
  }
  const handleClose = () => {
      setOpenD(false)
      setTeamError(false)
  }

  const theme = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(255, 255, 255)",
          },
         }
        }}
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

  
  const [curTim, setTim] = useState(-1)
  const [prevOrg, setPrevOrg] = React.useState(-1)
  const [curClanTima, setClanTima] = useState(-1)
  const [vodja, setVodja] = useState(false)
  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

  const hiddenFileInput = React.useRef(null);

  const handleClickFile = event => {
    hiddenFileInput.current.click();
  };

   const handleChangeFile = event => {
    const fileUploaded = event.target.files[0];

    const timID = (JSON.parse(window.localStorage.getItem('TimID')));
    fetch("https://localhost:5001/Tim/PromeniSlikuTima/"+timID+"/"+fileUploaded.name,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    alert("Photo is successfully changed 😀");
    window.location.reload(false);
  }
    
  return(
    <div style={{display:'flex'}}>
      <div className='teamMenu'>
          <Paper className='teamList' 
          style={{
            backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
            boxShadow : darkMode ? "0 8px 16px 0 rgb(0, 100, 100), 0 6px 20px 0 rgb(0, 100, 100)" : "",
          }}>
              <List>
              <ListItem key={0}>
                  <ThemeProvider theme={theme}>
                    <Button sx={{backgroundColor: 'white', alignSelf:'center'}}
                    onClick={() =>{handleClickOpenSimple();}}>
                      <Typography variant="h7" sx={{fontWeight:'bold'}}>
                          See Organisation Members
                      </Typography>
                    </Button>
                  </ThemeProvider>
              </ListItem>
              <ListItem key={1}>
                      <Typography variant="h7" sx={{
                        fontWeight:'bold',
                        color : darkMode ? "white " : "black",
                        }}>
                          Teams
                      </Typography>
              </ListItem>
              <ListItem key={2} style={{display: props.clanID!=-1? 'inline' : 'none'}}>
                  <ThemeProvider theme={theme}>
                    <Button >
                      <IconButton onClick={() => {handleClick()}} sx={{backgroundColor: 'white', marginRight:'10px'}} >
                        <AddCircleIcon/>
                      </IconButton>
                      <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                          Add Team
                      </Typography>
                    </Button>
                  </ThemeProvider>
              </ListItem>
              {teams.map(team => (
                  <ListItem key={team.idTima+2} className={curTim==team.idTima? 'activeEnt' : null}>
                    <ThemeProvider theme={theme}>
                      {/*<Button onClick={() =>{setTim(team.idTima); localStorage.setItem('TimID',team.idTima); localStorage.setItem('clanTimaID',team.idClan);  setVodja(team.vodja);}}>
                        <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                          <SubjectOutlined/>
                        </IconButton>
                        <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
              </Button>*/}
               <Avatar src={"../../TandO/"+team.slika} onClick={() =>{setTim(team.idTima); setClanTima(team.idClan); localStorage.setItem('TimID',team.idTima); localStorage.setItem('clanTimaID',team.idClan);  setVodja(team.vodja);}} onDoubleClick={handleClickFile}>
                T
               </Avatar> 
                <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />
                <Typography variant="h7" sx={{ marginLeft:'10px',fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
                    </ThemeProvider>
                  </ListItem>
              ))}
              </List>
          </Paper>
          <ThemeProvider theme={theme}>
            <Dialog open={openD} onClose={handleClose}>
                <DialogTitle style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                  color : darkMode ? "white" : "black",
                }}>
                        Chose a name for your team 
                </DialogTitle>
                <DialogContent style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                }}>
                    <ThemeProvider theme={theme}>
                        <TextField id="outlined-basic" label="Team Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                        onChange={(e) => setTeamName(e.target.value)}
                        error={teamError}
                        sx={{
                            width :"100%",
                            marginTop : "5%",
                            marginBottom : "5%",
                            }}/>                      
                    </ThemeProvider>
                </DialogContent>
                <DialogActions style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {addTeam() ; }}>Sumbit</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
      </div>
      <ProjectMenu vodjaStatus={vodja} timID = {curTim} clanTimaID = {curClanTima}/>
      <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                clanID = {props.clanID}
                vodjaStatus = {vodja}
              />
    </div>
  )
}
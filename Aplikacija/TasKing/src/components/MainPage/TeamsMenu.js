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
import QrCode2Icon from '@mui/icons-material/QrCode2';
import GroupsIcon from '@mui/icons-material/Groups';

const drawerWidth = 240
const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

const theme1 = createTheme({
  components:{
    MuiButton: {styleOverrides:{
      root: {
       "&:hover": {
         backgroundColor: "rgb(31, 206, 206);",
       },
      }
     }}  
  },
  palette: {
    primary: {
      //main: "rgb(161, 17, 161)",
      main: "rgb(0, 100, 100)",
    },
    secondary:{
      main : "rgb(0, 100, 0)",
    }
  },
});

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
    <Dialog onClose={handleClose} open={open} style={{ color : darkMode ? "rgb(26,25,25)" : "white" }}>
      <DialogTitle style={{
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white": "black",
      }}>Members</DialogTitle>
      <DialogContent style={{ backgroundColor : darkMode ? "rgb(26,25,25)":"white"}}>
      <div style={{marginBottom: '30px', display: props.adminStatus? 'inile' : 'none' ,backgroundColor : darkMode ? "rgb(26,25,25)" :"white"}}>
      <ThemeProvider theme={theme}>
      <TextField onChange={ (e) => setUserName(e.target.value) }
                  sx= {{marginLeft: '50px', marginTop: '5px'}}  error={userError} id="outlined-basic" label="Username" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary"/>
      </ThemeProvider>
      <ThemeProvider theme={theme1}>
      <Button sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', marginTop: '5px'}}
       onClick={() => handleInvite()}
       color="primary"
       variant="contained">
        Invite
      </Button>
      <Button sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', marginTop: '5px'}}
       onClick={() => {navigator.clipboard.writeText(window.localStorage.getItem('OrgKod'))}}
       color="primary"
       variant="contained">
        Copy code
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
              <Avatar src={"../../profile/"+member.korisnik.profilnaSlika} sx={{ bgcolor: blue[100], color: blue[600] }}>
              {member.korisnik.ime.slice(0,1)}{member.korisnik.prezime.slice(0,1)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme} />
            <ThemeProvider theme={theme1}>
              <Button
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}
                onClick={() => visitProfile(member.korisnik.id)}
                color="primary"
                variant="contained">
                View Profile
              </Button>
              <Button
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', display: props.adminStatus? 'inile' : 'none'}}
              onClick={()=>handleRemove(member.clanOrgID)}
              color="primary"
              variant="contained">
                 Remove
              </Button>
            </ThemeProvider>
          </ListItem>
        ))} 
      </List>
      </DialogContent>
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
  
  const generateCode = () => {
    let num ='1ABCD2EFG3HIJK4LMN5OPQ6RS7TUV8WXYZ9';
    let OTP ='';
    for ( let i =0 ; i<6;i++){
      OTP +=num[Math.floor(Math.random()*10)];
    }
    return OTP;
}

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
      kod : generateCode(),
      
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

  const [openJoinD, setOpenJoinD] = useState(false)
  const [curTim, setTim] = useState(-1)
  const [prevOrg, setPrevOrg] = React.useState(-1)
  const [curClanTima, setClanTima] = useState(-1)
  const [vodja, setVodja] = useState(false)
  const [teamCode , setTeamCode] = useState('')
  const [teamCodeError , setTeamCodeError] = useState(false)
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

  async function  handleJoinTeam()  {
    
    if (teamCode === ''){
      setTeamCodeError(true)
    }
    else {
      // joinTeam(userID ,orgID)
      console.log(teamCode)

      let temp = await fetch("https://localhost:5001/Tim/VratiTim/"+teamCode , {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      let statusTima = temp.status;
      temp = await temp.json();
      console.log(temp);
      let idNovogTima = temp;
      console.log(statusTima);

      if (temp != 0){


        let nzm = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijuTim/" +idNovogTima , {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        });
        nzm = await nzm.json();
        let idORG = nzm ;


        const userN = (JSON.parse(window.localStorage.getItem('user-info')));
        console.log(userN.id);

        const ClanOrganizacije = {
          idKorisnika : userN.id,
          idOrganizacije : idORG,
          admin : false
        }

        let rezultat = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
          body : JSON.stringify(ClanOrganizacije)
        });
        let statusU = rezultat.status ;
        rezultat = await rezultat.json();
        let idClanaORG = rezultat ;
        console.log("IDclanaOrganizacije :" ,idClanaORG);
        console.log(statusU);


        if (statusU === 200){


          const ClanTima = {
            idClanaOrganizacije : idClanaORG,
            idtima : idNovogTima,
            vodja : false
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
  
          let statusTmp = tmp.status;
          if ( statusTmp === 200){
            alert("uspesno ste uclanjeni u tim")
            window.location.reload(false);
          }
        }
      }
      else {
        alert("Netacan kod !")
        setTeamCodeError(true)
        setTeamCode("");
      }

       // routeChange()
    }

  }

  const handleJoinClose = () => {
    setOpenJoinD(false)
}


  const handleJoinClick = () => {
    console.log("Otvoren dijalog")
    setOpenJoinD(true);
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
                  <ListItem key={team.idTima+3} className={curTim==team.idTima? 'activeEnt' : null}>
                    <ThemeProvider theme={theme}>
                      {/*<Button onClick={() =>{setTim(team.idTima); localStorage.setItem('TimID',team.idTima); localStorage.setItem('clanTimaID',team.idClan);  setVodja(team.vodja);}}>
                        <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                          <SubjectOutlined/>
                        </IconButton>
                        <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
              </Button>*/}
               <Avatar src={"../../TandO/"+team.slika} onClick={() =>{setTim(team.idTima); setClanTima(team.idClan); localStorage.setItem('TimID',team.idTima); localStorage.setItem('clanTimaID',team.idClan);  setVodja(team.vodja);}} onDoubleClick={team.vodja? handleClickFile : null}>
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
                    <ThemeProvider theme={theme1} ><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                    <ThemeProvider theme={theme1}><Button onClick={() => {addTeam() ; }} variant="contained" color="primary" sx={{fontWeight:"bold"}}>Sumbit</Button></ThemeProvider>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
        <ThemeProvider theme={theme}>
            <Dialog open={openJoinD} onClose={handleJoinClose}>
                <DialogContent style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                }}>
                    <label className={darkMode ? "labelDM":"label"}>Join a team with a code</label>
                    <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
                        <ThemeProvider theme={theme}>
                            <TextField onChange={ (e) => setTeamCode(e.target.value) } error={teamCodeError}
                            value = {teamCode}
                            sx={{ width : "50%" , marginLeft : "25%" , marginRight : "25%" , marginTop : "5%"}}
                            id="outlined-basic" label="Enter Code" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" size="small" type="text" color="primary" required/>
                        </ThemeProvider>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <button className={darkMode ? "buttonJoin1DM":"buttonJoin1"} style={{marginTop:'10px', marginBottom:'0', marginLeft:'0', marginRight:'0', height:'35px', width:'100px'}} onClick={(event) => { event.preventDefault() ; handleJoinTeam(); } }>Join</button>
                        </div>
                        
                </DialogContent>
            </Dialog>
        </ThemeProvider>
      </div>
      <ProjectMenu vodjaStatus={vodja} timID = {curTim} clanTimaID = {curClanTima}/>
      <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                clanID = {props.clanID}
                vodjaStatus = {vodja}
                adminStatus = {props.adminStatus}
              />
    </div>
  )
}

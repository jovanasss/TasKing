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
import { yellow } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import GroupsIcon from '@mui/icons-material/Groups';
import { Store } from 'react-notifications-component';

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
  const [isAdmin , setAdmin] = useState(false)
  

  async function handleInvite(){

    // error ako je neki input prazan
    if ( userName === ''){
      setUserError(true)
    }

     // oba imaju vrednost => logovanje 
    if (userName){

      const idOrg = (JSON.parse(window.localStorage.getItem('OrgID')));

      const clanOrgID = window.localStorage.getItem('clanOrgID');
      fetch("https://localhost:5001/Organizacija/PozoviUOrganizaciju/" + userName + "/" + idOrg + "/" + clanOrgID, {
        method: "POST"
        }).then(res =>{
          if(res.ok)
            {
              Store.addNotification({
                title: "Success",
                message: "you have successfully invited a member",
                type: "success",
                insert: "top",
                container: "top-center",
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
            }
            else
            {
              res.json().then(data => {
                if(data==1)
                {
                  Store.addNotification({
                    title: "User doesn't exist",
                    message: "We haven't found a user with such username",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
                }

                if(data==2)
                alert("organizacija ne postoji");

                if(data==3)
                {
                  Store.addNotification({
                    title: "The ivite is already sent",
                    message: "You've already sent a invite to this member",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
                }

                if(data==4)
                {
                  Store.addNotification({
                    title: "The user is already an organisation member",
                    message: "",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
                }
              });
            }
        })
    }
  }

  const handleClose = () => {
    onClose(selectedValue);
  };


  const handleRemove = (clanID) => {
    const clanOrgID = window.localStorage.getItem('clanOrgID');
    fetch("https://localhost:5001/Organizacija/IzbaciClana/" + clanID + "/" + clanOrgID,
          {
              method: "PUT"
          }).then(s =>{
              if(s.ok)
              {
                 //alert("uspesno je izbacen clan");
                 if(props.clanID==-1)
                    return;
                    const token = window.localStorage.getItem('clanOrgID');
                    if(token==="-1" || token===null)
                    {
                      return;
                    }
                  fetch("https://localhost:5001/Organizacija/VratiClanoveOrganizacije/" + token,
                  {
                      method:"GET",
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  }).then(res => {
                    if(res.ok)
                    {
                      res.json().then(data => {
                        setMembers(data)
                      });
                    }
                    else
                    {
                      alert("Greska pri vracanju organizacija korisnika");
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
      const token = window.localStorage.getItem('clanOrgID');
      if(token==="-1" || token===null)
      {
        return;
      }
    fetch("https://localhost:5001/Organizacija/VratiClanoveOrganizacije/" + token,
  {
      method:"GET",
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => {
    if(res.ok)
    {
      res.json().then(data => {
        setMembers(data)
      });
    }
    else
    {
      alert("Greska pri vracanju organizacija korisnika");
    }
  })
 }, [props.clanID, props.change]);

 async function copyOrgKod () {
  let rez = await fetch("https://localhost:5001/Organizacija/VratiKodOrganizacije/" + localStorage.getItem('clanOrgID'),
  {
      method:"GET",
      headers: {
          'Content-Type': 'application/json',
      },
  });
  rez = await rez.json();
  let kod  = rez.kod;
  navigator.clipboard.writeText(kod);
 }

 async function adminStatus () {
  if(localStorage.getItem('clanOrgID')<=-1 || localStorage.getItem('clanOrgID')===null)
  {
    setAdmin(false);
    return;
  }
    let rez = await fetch("https://localhost:5001/Organizacija/VratiAdminStatus/" + localStorage.getItem('clanOrgID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    rez = await rez.json();
    let admin  = rez.admin;
    setAdmin(admin);
 }

 React.useEffect(() => {
  adminStatus();
}, [props, localStorage.getItem('clanOrgID')]);

  return (
    <Dialog onClose={handleClose} open={open} style={{ color : darkMode ? "rgb(26,25,25)" : "white" }}>
      <DialogTitle style={{
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white": "black",
      }}>Members</DialogTitle>
      <DialogContent style={{ backgroundColor : darkMode ? "rgb(26,25,25)":"white"}}>
      <div style={{marginBottom: '30px', display: isAdmin? 'inline' : 'none' ,backgroundColor : darkMode ? "rgb(26,25,25)" :"white"}}>
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
       onClick={() => {copyOrgKod();}}
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
        {members.filter(member => member.korisnik.id!=JSON.parse(window.localStorage.getItem('user-info'))).map((member) => (
          <ListItem key={member.clanOrgID} sx={{ bgcolor:member.admin? blue[100] : 'auto', color: member.admin? blue[600] : 'auto'}} >
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
              sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '20px', display: isAdmin? 'inline' : 'none'}}
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
  const [changetim, setChange] = useState(false)

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
    const token = window.localStorage.getItem('clanOrgID');
    if(token==="-1" || token===null)
    {
      setTeams([])
      //setTim(-1)
      setClanTima(-1)
      //localStorage.setItem('TimID',-1)
      //localStorage.setItem('clanTimaID',-1)
      setVodja(false)
      return;
    }
    
    fetch("https://localhost:5001/Organizacija/VratiClanoveTima/" + token,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        res.json().then(data => {
          setTeams(data)
          if(data==undefined || data==null)
          {
            setTim(-1)
            setClanTima(-1)
            localStorage.setItem('TimID',-1)
            localStorage.setItem('clanTimaID',-1)
            setChange(!changetim)
            setVodja(false)
            return;
          }
         
          if(data.length==0)
          {
            setTim(-2)
            setClanTima(-2)
            localStorage.setItem('TimID',-2)
            localStorage.setItem('clanTimaID',-2)
            setChange(!changetim)
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

              const token = (JSON.parse(window.localStorage.getItem('user-info')));

              fetch("https://localhost:5001/Tim/UlogujClanaTima/" + data[0].idClan + "/" + token.value,
              {
                  method:"POST",
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }).then(res =>{
                if(res.ok){
                  res.json().then(data => {
                    //console.log(data.value);
                    localStorage.setItem('clanTimaID',data.value);
                    setChange(!changetim)
                  })
                }
              })

              //localStorage.setItem('clanTimaID',data[0].idClan)
            }
              else
              {
                setTim(window.localStorage.getItem('TimID'))
                
                // desifrovanje

                fetch("https://localhost:5001/Tim/VratiIDClanaTima/" + localStorage.getItem('clanTimaID'),
                {
                    method:"GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res =>{
                  if(res.ok){
                    res.json().then(data => {
                      //console.log(data.id);
                      setClanTima(data.id);
                      //clanID = data.id;
                    })
                  }
                }) ;

              // setClanTima(window.localStorage.getItem('clanTimaID')) 
              }
          }
          else
          {

            const token = (JSON.parse(window.localStorage.getItem('user-info')));
            fetch("https://localhost:5001/Tim/UlogujClanaTima/" + data[0].idClan + "/" + token.value,
            {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res =>{
              if(res.ok){
                res.json().then(data2 => {
                  //console.log(data2.value + "adawdawdawdawdawda");
                  setTim(data[0].idTima)
                  setClanTima(data[0].idClan) 
                  localStorage.setItem('TimID',data[0].idTima)
                  localStorage.setItem('clanTimaID',data2.value);
                  setChange(!changetim)
                })
              }
            })

           // localStorage.setItem('clanTimaID',data[0].idClan)
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
        res.json().then(data => {
          if(data==-2)
            alert("Invalid token");
            return;
        })
        alert("Invalid team");
      }
    })
  }

  useEffect(() => {
    showTeams();
  }, [props.clanID, props.change]);
  
  const generate = () => {
    let num ='1ABCD2EFG3HIJK4LMN5OPQ6RS7TUV8WXYZ9';
    let OTP ='';
      for ( let i =0 ; i<6;i++){
        OTP +=num[Math.floor(Math.random()*10)];
      }
      return OTP
  }
  async function generateCode()  {

    let codeValid = false ; 

    while(!codeValid){

      let OTP =  generate();
      //console.log(OTP);
      const token = (JSON.parse(window.localStorage.getItem('user-info')));
      let result = await fetch("https://localhost:5001/Tim/TeamCodeCheck/" + OTP + "/" + token.value,
      {
          method:"GET",
          headers: {
              'Content-Type': 'application/json',
          },
      });
      result = await result.json();
      //console.log(result);
      if ( result === false){
        //console.log(result , OTP);
        codeValid = true ;
        return OTP;
      }
    }
}

  async function addTeam() {

    //console.log("a");

    let idClanaOrg = await fetch("https://localhost:5001/Organizacija/VratiIDClanaOrganizacije/" + localStorage.getItem('clanOrgID'), // desifrovanje tokena 
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    idClanaOrg = await idClanaOrg.json();
    let idClana  = idClanaOrg.id;

    //console.log(idClana);

    let result = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijuClana/" + localStorage.getItem('clanOrgID'), 
    {
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
      kod :  await generateCode(),  
      }
      //console.log(tim);
    const organizacijaID = (JSON.parse(window.localStorage.getItem('OrgID')));
    const token = JSON.parse(window.localStorage.getItem('user-info'));
    let proveraTima = await fetch("https://localhost:5001/Tim/VratiTimIME/"+teamName+"/"+organizacijaID +"/"+ token.value, {
      method : 'GET',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
    });
    proveraTima = await proveraTima.json();
    
    
    if (proveraTima === 0){
      setOpenD(false)
      const a = (JSON.parse(window.localStorage.getItem('user-info')));
      let rezultat = await fetch("https://localhost:5001/Tim/KreirajTim/"+ a.value, {
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
      const vodja = true ;
      //result  = await result.json();
      
  
        const ClanTima = {
          idClanaOrganizacije : idClana,
          idtima : idNovogTima,
          vodja : vodja
        }
        const token = (JSON.parse(window.localStorage.getItem('user-info')));
        let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/" + token.value,{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
          body : JSON.stringify(ClanTima)
        });
        //localStorage.setItem('TimID', idNovogTima)
        //localStorage.setItem('clanTimaID',data[0].idClan)

        localStorage.setItem('TimID',idNovogTima); 

        tmp = await tmp.json();
               fetch("https://localhost:5001/Tim/UlogujClanaTima/" + tmp + "/" + token.value, 
               {
                   method:"POST",
                   headers: {
                       'Content-Type': 'application/json',
                   },
               }).then(res =>{
                 if(res.ok){
                   res.json().then(data => {
                     //console.log(data.value);
                     localStorage.setItem('clanTimaID',data.value);
                     setChange(!changetim)
                   })
                 }
               })

       window.location.reload(false);
    }
    else{
      Store.addNotification({
        title: "Warning",
        message: "Team with such name already exists in this organisation",
        type: "danger",
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
      setTeamError(true);  
    }


  }
  // otvaranje i zatvaranje Dijaloga 
  const handleClick = () => {
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const onWindowChange =() =>{
    setScreenWidth(window.innerWidth)
  };

  window.addEventListener('resize', onWindowChange);

  const hiddenFileInput = React.useRef(null);
  

  const handleClickFile = event => {
    hiddenFileInput.current.click();
  };

   const handleChangeFile = event => {
    const fileUploaded = event.target.files[0];
    const timID = (JSON.parse(window.localStorage.getItem('TimID')));
    const clanTimaID = window.localStorage.getItem('clanTimaID');
    fetch("https://localhost:5001/Tim/PromeniSlikuTima/"+timID+"/"+fileUploaded.name+"/"+clanTimaID,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    /*Store.addNotification({
      title: "Success",
      message: "you have successfully changed your photo",
      type: "success",
      insert: "top",
      container: "top-center",
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });*/
    window.location.reload(false);
  }

  async function  handleJoinTeam()  {
    
    if (teamCode === ''){
      setTeamCodeError(true)
    }
    else {
      // joinTeam(userID ,orgID)
      const token = (JSON.parse(window.localStorage.getItem('user-info')));

      let temp = await fetch("https://localhost:5001/Tim/VratiTim/"+teamCode + "/" + token.value, {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      let statusTima = temp.status;
      temp = await temp.json();
      let idNovogTima = temp;

      if (temp != 0){


        let nzm = await fetch("https://localhost:5001/Organizacija/VratiOrganizacijuTim/" +idNovogTima  + "/" + token.value, {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        });
        nzm = await nzm.json();
        let idORG = nzm ;


        const userN = (JSON.parse(window.localStorage.getItem('user-info')));

        const ClanOrganizacije = {
          idKorisnika : userN,
          idOrganizacije : idORG,
          admin : false
        }

        let rezultat = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/" + userN.value,{
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
  
        if (statusU === 200){


          const ClanTima = {
            idClanaOrganizacije : idClanaORG,
            idtima : idNovogTima,
            vodja : false
          }
  
  
          let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/"+ localStorage.getItem('user-info'),{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanTima)
          });
  
          let statusTmp = tmp.status;
          if ( statusTmp === 200){
            Store.addNotification({
              title: "Joined!",
              message: "you have successfully joined the organization",
              type: "success",
              insert: "top",
              container: "top-center",
              dismiss: {
                duration: 2000,
                onScreen: true
              }
            });
            window.location.reload(false);
          }
        }
      }
      else {
        Store.addNotification({
          title: "Invalid code",
          message: "The code you enter isn't valid please try again",
          type: "danger",
          insert: "top",
          container: "top-center",
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
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
    setOpenJoinD(true);
  }
    
  return(
    <div style={{display:'flex'}}>
      <div className='teamMenu'>
          <Paper className='teamList' 
          style={{
            backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
            boxShadow : darkMode ? "0 8px 16px 0 rgb(0, 100, 100), 0 6px 20px 0 rgb(0, 100, 100)" : "",
            display: (screenWidth> 900 || props.openMenu)? 'flex' : 'none'
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
                    <div style={{marginLeft:"12px"}}>
                      <IconButton onClick={() => {handleClick()}} sx={{backgroundColor: 'white', marginRight:'4px'}} >
                        <AddCircleIcon/>
                      </IconButton>
                      <ThemeProvider theme={theme}>
                      <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left', fontSize:"14px"}} color="primary">
                          ADD TEAM
                      </Typography>
                      </ThemeProvider>
                    </div>  
              </ListItem>
              {teams.map(team => (
                  <ListItem key={team.idTima+3} className={curTim==team.idTima? 'activeEnt' : null} sx={{ bgcolor: curTim==team.idTima? (team.vodja? 'rgb(15, 105, 105)' : 'rgb(26, 167, 167)') : (team.vodja? (darkMode? 'rgb(22, 22, 22)' : green[50]) : 'auto')}} >
                    <ThemeProvider theme={theme}>
                      {/*<Button onClick={() =>{setTim(team.idTima); localStorage.setItem('TimID',team.idTima); localStorage.setItem('clanTimaID',team.idClan);  setVodja(team.vodja);}}>
                        <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                          <SubjectOutlined/>
                        </IconButton>
                        <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
              </Button>*/}
               <Avatar src={"../../profile/"+team.slika} onClick={() =>{setTim(team.idTima); setClanTima(team.idClan); localStorage.setItem('TimID',team.idTima); 

               //localStorage.setItem('clanTimaID',team.idClan);
               localStorage.setItem('clanTimaID',-1);
               const token = (JSON.parse(window.localStorage.getItem('user-info')));
               fetch("https://localhost:5001/Tim/UlogujClanaTima/" + team.idClan + "/" + token.value,
               {
                   method:"POST",
                   headers: {
                       'Content-Type': 'application/json',
                   },
               }).then(res =>{
                 if(res.ok){
                   res.json().then(data => {
                     //console.log(data.value);
                     localStorage.setItem('clanTimaID',data.value);
                     setChange(!changetim)
                   })
                 }
               })

               setVodja(team.vodja);}} onDoubleClick={team.vodja? handleClickFile : null}>
                T
               </Avatar> 
                <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />
                {team.imeTima.length > 15 
                ?
                <Tooltip title={team.imeTima}>
                   <Typography variant="h7" sx={{ marginLeft:'10px',fontWeight:'bold', textAlign: 'left', color: darkMode? 'white' : 'auto'}}>
                            {team.imeTima.slice(0,15) + "..."}
                    </Typography>
                </Tooltip>
                :
                <Typography variant="h7" sx={{ marginLeft:'10px',fontWeight:'bold', textAlign: 'left', color: darkMode? 'white' : 'auto'}}>
                            {team.imeTima}
                  </Typography>}
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
      <div
      style={{
        height: '100vh',
        width:screenWidth> 900? 'calc(100vw - 275px)' : '100vw',
        overflowY: 'auto',
        overflowX: 'hidden'}}>
        <ProjectMenu timID = {curTim} clanTimaID = {curClanTima} change={changetim}/>
      </div>
      <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                clanID = {props.clanID}
                vodjaStatus = {vodja}
                change={props.change}
              />
    </div>
  )
}

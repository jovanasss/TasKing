import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/LeftMenu.css';
import { useNavigate } from "react-router-dom";
import { Button, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, Paper, TextField, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TeamsMenu from './TeamsMenu';
import Avatar from '@mui/material/Avatar';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import GroupsIcon from '@mui/icons-material/Groups';
import CodeIcon from '@mui/icons-material/Code';
const drawerWidth = 240     


export default function LeftMenu(props){

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  const [organisations, setOrganisations] = useState([])
  const [orgCode , setOrgCode] = useState('')
  const [orgCodeError , setOrgCodeError] = useState(false)
  const [teamCode , setTeamCode] = useState('')
  const [teamCodeError , setTeamCodeError] = useState(false)
  const [openOrgD, setOpenOrgD] = useState(false)
  const [openD, setOpenD] = useState(false)
  const [admin, setAdmin] = useState(false)

  const showOrganisations = ()=>{
    
    const user = (JSON.parse(window.localStorage.getItem('user-info')));


    fetch("https://localhost:5001/Korisnik/VratiClanoveOrganizacije/" + user.id,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
      if(res.ok)
      {
        res.json().then(data => {
          setOrganisations(data)
          if(data==undefined || data==null)
          return;
         
          if(data.length==0)
            return;  
  
          if(window.localStorage.getItem("clanOrgID") === null)
          {
            setOrg(data[0].idClan)
            localStorage.setItem('clanOrgID',data[0].idClan)
            localStorage.setItem('OrgID',data[0].orgID)
            localStorage.setItem('OrgKod',data[0].kod)
            setAdmin(data[0].administrator)
          }
          else
          {
            setOrg(window.localStorage.getItem('clanOrgID'))
            for(let i=0; i< data.length; i++)
            {
              if(data[i].idClan==window.localStorage.getItem('clanOrgID'))
                {
                  setAdmin(data[i].administrator)
                  break;
                }
            }
          }
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
  }

  async function  handleJoinTeam()  {
    
    if (teamCode === ''){
      setTeamCodeError(true)
      setOrgCodeError(false)
    }
    else {
      setOrgCode("")
      // joinTeam(userID ,orgID)

      let temp = await fetch("https://localhost:5001/Tim/VratiTim/"+teamCode , {
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

        if (statusU === 200){


          const ClanTima = {
            idClanaOrganizacije : idClanaORG,
            idtima : idNovogTima,
            vodja : false
          }
  
  
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

            routeChange();

          }
        }
      }
      else {
        alert("Netacan kod !")
        setOrgCodeError(false)
        setTeamCodeError(true)
        setTeamCode("");
      }

       // routeChange()
    }

  }

  async function handleJoinOrg()  {

    if (orgCode === ''){
      setOrgCodeError(true)
    }
    else {
      // joinOrg(userID ,orgID)

      let temp = await fetch("https://localhost:5001/Organizacija/VratiOrganizaciju/"+orgCode , {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8'
        },
      });
      temp = await temp.json();
      let idNoveOrg = temp;
      if (temp != 0){
        const userN = (JSON.parse(window.localStorage.getItem('user-info')));
  
        const ClanOrganizacije = {
          idKorisnika : userN.id,
          idOrganizacije : idNoveOrg,
          admin : false,
        }
  
          let tmp = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(ClanOrganizacije)
          });
          let noviStatus = tmp.status;
          if ( noviStatus === 200){
              alert("Uspesno ste se uclanili u organizaciju")
              window.location.reload(false);
          }
  
  
        // routeChange()
      }
      else {
        alert("Netacan kod !")
        setOrgCodeError(true);
      }
      }


  }

  const handleClick = () => {
    setOpenD(true);
    teamCodeError(false);
}
const handleClose = () => {
    setOpenD(false)
    teamCodeError(false)
}

  const handleOrgClose = () => {
    setOpenOrgD(false)
}

const handleOrgClick = () => {
  setOpenOrgD(true);
}


  let navigate = useNavigate();
  // promena strane
  const routeChange = () =>{ 
    let path = `/cORG`; 
    navigate(path);
  }

  useEffect(() => {
    showOrganisations();
  }, []);

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

  const [curOrg, setOrg] = useState(-1)

  const hiddenFileInput = React.useRef(null);

  const handleClickFile = event => {
    hiddenFileInput.current.click();
  };

   const handleChangeFile = event => {
    const fileUploaded = event.target.files[0];

    const orgID = (JSON.parse(window.localStorage.getItem('OrgID')));
    fetch("https://localhost:5001/Organizacija/PromeniSlikuOrganizacije/"+orgID+"/"+fileUploaded.name,
    {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    })
    alert("Photo is successfully changed 😀");
    //const ClanOrgID = (JSON.parse(window.localStorage.getItem('clanOrgID')));
    //localStorage.setItem('clanOrgIDBackup',ClanOrgID);
    window.location.reload(false);
    //setOrg((JSON.parse(window.localStorage.getItem('clanOrgIDBackup'))));
  }

  return(
    <div style={{display: 'flex', position: 'fixed', zIndex: '1', top: '0', left: '0', overflowX: 'hidden'}}>
    <div className={darkMode ? 'leftMenuDM' :'leftMenu'}>
    <Paper className='leftList' 
    style={{
      backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
      boxShadow : darkMode ? "0 8px 16px 0 rgb(0, 100, 100), 0 6px 20px 0 rgb(0, 100, 100)" : "",
      }} >
        <List className='listDiv'>
          <ListItem key={0}>
              <ThemeProvider theme={theme}>
              <Tooltip title="Add Organisation">
                <IconButton sx={{backgroundColor: 'white'}} onClick={() => routeChange()}>
                  <AddCircleIcon/>
                </IconButton>
                </Tooltip>
              </ThemeProvider>
            </ListItem>
            <ListItem key={1}>
              <ThemeProvider theme={theme}>
              <Tooltip title="Join an organisation with code">
                <IconButton sx={{backgroundColor: 'white'}} onClick={() => handleOrgClick()}>
                  <CodeIcon/>
                </IconButton>
                </Tooltip>
              </ThemeProvider>
            </ListItem>
            <ListItem key={2}>
              <ThemeProvider theme={theme}>
              <Tooltip title="Join a team with code">
                <IconButton sx={{backgroundColor: 'white'}} onClick={() => handleClick()}>
                  <CodeIcon/>
                </IconButton>
                </Tooltip>
              </ThemeProvider>
            </ListItem>
           {organisations.map(item => (
             <ListItem key={item.idClan+3} className={curOrg==item.idClan? 'activeEnt' : null}>
              <ThemeProvider theme={theme}>
                <Tooltip title={item.imeOrganizacije}>
                 {/*} <IconButton src={"../../TandO/"+item.slika}  onClick={() =>{setOrg(item.idClan); localStorage.setItem('clanOrgID',item.idClan); localStorage.setItem('OrgID',item.orgID) }} onDoubleClick={handleClickFile} sx={{backgroundColor: 'white'}}>
                  <SubjectOutlined />
                 </IconButton>
                </Tooltip>
                <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />*/}
               <Avatar src={"../../TandO/"+item.slika} onClick={() =>{setOrg(item.idClan); localStorage.setItem('clanOrgID',item.idClan); localStorage.setItem('OrgID',item.orgID); localStorage.setItem('OrgKod',item.kod); setAdmin(item.administrator) }} onDoubleClick={item.administrator? handleClickFile : null}>
                Org
               </Avatar>
               </Tooltip>   
               <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />
              </ThemeProvider>
             </ListItem>
           ))}
        </List>
      </Paper>
      <ThemeProvider theme={theme}>
            <Dialog open={openOrgD} onClose={handleOrgClose}>
                <DialogContent style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                }}>
                    <label className={darkMode ? "labelDM":"label"}>Join a organization with a code</label>
                    <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
                        <ThemeProvider theme={theme}>
                            <TextField onChange={ (e) => setOrgCode(e.target.value) } error={orgCodeError}
                            value = {orgCode}
                            sx={{ width : "50%" , marginLeft : "25%" , marginRight : "25%" , marginTop : "5%"}}
                            id="outlined-basic" label="Enter Code" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" size="small" type="text" color="primary" required/>
                        </ThemeProvider>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <button className={darkMode ? "buttonJoin1DM":"buttonJoin1"} style={{marginTop:'10px', marginBottom:'0', marginLeft:'0', marginRight:'0', height:'35px', width:'100px'}} onClick={(event) => { event.preventDefault() ; handleJoinOrg(); } }>Join</button>
                        </div>
                        
                </DialogContent>
            </Dialog>
        </ThemeProvider>
        <ThemeProvider theme={theme}>
            <Dialog open={openD} onClose={handleClose}>
                <DialogContent style={{
                  backgroundColor : darkMode ? "rgb(46, 45, 45)" : "white",
                }}>
                    <label className={darkMode ? "labelDM":"label"}>Join a team with a code</label>
                    <div  className="divIcons"><div className="divIcon"><GroupsIcon /></div></div>
                        <ThemeProvider theme={theme}>
                            <TextField onChange={ (e) => setTeamCode(e.target.value) } error={teamCodeError}
                            value = {orgCode}
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
    <TeamsMenu clanID={curOrg} adminStatus = {admin}/>
    </div>
  )
}
import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/TeamsMenu.css';
import { Avatar, Button, createTheme, Icon, IconButton, List, ListItem, ListItemIcon, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControlLabel, TextField , Box, Dialog, DialogTitle , DialogContent ,DialogContentText,DialogActions } from "@mui/material";
import { Autorenew, SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import ProjectMenu from './ProjectMenu';
const drawerWidth = 240

export default function TeamsMenu(props){

  const [openD, setOpenD] = useState(false)
  const [teams, setTeams] = useState([])
  const [teamName ,setTeamName] = useState('')
  const showTeams = ()=>{
    const org = window.localStorage.getItem('clanOrgID');
    console.log(org);

    if(props.clanID==-1)
    {
      setTeams([])
      setTim(-1)
      localStorage.setItem('clanTimaID',-1)
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
            localStorage.setItem('clanTimaID',-1)
            setVodja(false)
            return;
          }
         
          if(data.length==0)
          {
            setTim(-1)
            localStorage.setItem('clanTimaID',-1)
            setVodja(false)
            return;
          }
          console.log(data[0].idTima);
          setTim(data[0].idTima)
          localStorage.setItem('clanTimaID',data[0].idTima)
          setVodja(data[0].vodja)
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


  }
  // otvaranje i zatvaranje Dijaloga 
  const handleClick = () => {
      console.log("Otvoren dijalog")
      setOpenD(true);
  }
  const handleClose = () => {
      setOpenD(false)
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
  const [vodja, setVodja] = useState(false)
    
  return(
    <div style={{display:'flex'}}>
      <div className='teamMenu'>
          <Paper className='teamList'>
              <List>
              <ListItem key={0} style={{display: props.clanID!=-1? 'inline' : 'none'}}>
                  <ThemeProvider theme={theme}>
                    <Button >
                      <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}} >
                        <AddCircleIcon/>
                      </IconButton>
                      <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                          Add Team
                      </Typography>
                    </Button>
                  </ThemeProvider>
              </ListItem>
              {teams.map(team => (
                  <ListItem key={team.idTima} className={curTim==team.idTima? 'activeEnt' : null}>
                    <ThemeProvider theme={theme}>
                      <Button onClick={() =>{setTim(team.idTima); localStorage.setItem('clanTimaID',team.idTima);  setVodja(team.vodja);}}>
                        <IconButton sx={{backgroundColor: 'white', marginRight:'10px'}}>
                          <SubjectOutlined/>
                        </IconButton>
                        <Typography variant="h7" sx={{fontWeight:'bold', textAlign: 'left'}}>
                            {team.imeTima.slice(0,30) + (team.imeTima.length>30? "..." : "")}
                        </Typography>
                      </Button>
                    </ThemeProvider>
                  </ListItem>
              ))}
              </List>
          </Paper>
                              <ThemeProvider theme={theme}>
                                <Dialog open={openD} onClose={handleClose}>
                                    <DialogTitle>
                                            Chose a name for your team 
                                    </DialogTitle>
                                    <DialogContent>
                                        <ThemeProvider theme={theme}>
                                            <TextField id="outlined-basic" label="Team Name" variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                                            onChange={(e) => setTeamName(e.target.value)}
                                            sx={{
                                                width :"100%",
                                                marginTop : "5%",
                                                marginBottom : "5%",
                                                }}/>                      
                                        </ThemeProvider>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={addTeam}>Sumbit</Button>
                                    </DialogActions>
                                </Dialog>
                            </ThemeProvider>
      </div>
      <ProjectMenu vodjaStatus={vodja} timID = {curTim}/>
    </div>
  )
}
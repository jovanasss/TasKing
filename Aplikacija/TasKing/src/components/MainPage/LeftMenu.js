import React, { Component, useEffect, useState } from 'react';
//import '../styles/MainPage/LeftMenu.css';
import { useNavigate } from "react-router-dom";
import { createTheme, IconButton, List, ListItem, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { SubjectOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider } from '@emotion/react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TeamsMenu from './TeamsMenu';
import Avatar from '@mui/material/Avatar';
const drawerWidth = 240     


export default function LeftMenu(props){

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  const [organisations, setOrganisations] = useState([])
  const showOrganisations = ()=>{
    
    const user = (JSON.parse(window.localStorage.getItem('user-info')));
    console.log(user.id);


    fetch("https://localhost:5001/Korisnik/VratiClanoveOrganizacije/" + user.id,
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
          }
          else
          {
            setOrg(window.localStorage.getItem('clanOrgID'))
          }
        });
      }
      else
      {
        alert("uneli ste pogresno korisnicko ime ili lozinku");
      }
    })
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
           {organisations.map(item => (
             <ListItem key={item.idClan} className={curOrg==item.idClan? 'activeEnt' : null}>
              <ThemeProvider theme={theme}>
                <Tooltip title={item.imeOrganizacije}>
                 {/*} <IconButton src={"../../TandO/"+item.slika}  onClick={() =>{setOrg(item.idClan); localStorage.setItem('clanOrgID',item.idClan); localStorage.setItem('OrgID',item.orgID) }} onDoubleClick={handleClickFile} sx={{backgroundColor: 'white'}}>
                  <SubjectOutlined />
                 </IconButton>
                </Tooltip>
                <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />*/}
               <Avatar src={"../../TandO/"+item.slika} onClick={() =>{setOrg(item.idClan); localStorage.setItem('clanOrgID',item.idClan); localStorage.setItem('OrgID',item.orgID) }} onDoubleClick={handleClickFile}>
                Org
               </Avatar>
               </Tooltip>   
               <input type="file" ref={hiddenFileInput} onChange={handleChangeFile} style={{display: 'none'}} />
              </ThemeProvider>
             </ListItem>
           ))}
        </List>
      </Paper>
    </div>
    <TeamsMenu clanID={curOrg}/>
    </div>
  )
}
import * as React from 'react';
//import '../styles/MainPage/ProgressBar.css';
import {Button, AppBar, Toolbar, Typography, createTheme, DialogTitle, DialogContent, Dialog, IconButton} from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FormControlLabel, TextField } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PropTypes from 'prop-types';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const theme1 = createTheme({
  components:{
    MuiIconButton: {styleOverrides:{
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
  const [members, setMembers] = React.useState([])
  const [numOfPoints , setNumOfPoints] = React.useState(0)
  const [wholeValue , setWholeValue] = React.useState(0)
  const [suffix , setSuffix] = React.useState("points")
  const [userError , setUserError] = React.useState(false)

  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
  

  

  const handleClose = () => {
    onClose(selectedValue);
  };

  React.useEffect(() => {

    const clanTimaID = localStorage.getItem('clanTimaID');
    const projID = localStorage.getItem('projID');
    const timID = localStorage.getItem('TimID');
    //console.log(clanTimaID);
    //console.log(projID);
    //console.log(timID);
    if(timID<0 || projID<0 || clanTimaID<0
    || timID===null || projID===null || clanTimaID===null)
    {
      //console.log(clanTimaID+"aaaa");
      //console.log(projID+"aaaa");
      //console.log(timID+"aaaa");
      return;
    }

    fetch("https://localhost:5001/Projekat/VratiClanoveSaUcinkom/" + timID + "/" + projID + "/" + clanTimaID,
  {
      method:"GET",
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(res => {
    if(res.ok)
    {
      res.json().then(data => {
        setMembers(data.members.sort(function(a, b){return b.bodovi-a.bodovi}))
        setNumOfPoints(data.ukupniBodovi)
        setWholeValue(data.ukupniBodovi)
        setSuffix("points")
      });
    }
    else
    {
      //alert("Greska pri vracanju organizacija korisnika");
    }
  })

 }, [props]);

 let navigate = useNavigate();
  // promena strane
  const visitProfile = (korisnikID) =>{ 
    let path = `/Profile`; 
    localStorage.setItem('ProfileUser-info', korisnikID)
    navigate(path);
  }

  /*
              <div
                  style={{
                      width: ((member.bodovi*100)/numOfPoints)*0.1+"vw", 
                      border: "1px solid black", 
                      borderRadius:"10px",
                      height:"5px",
                      backgroundColor: 
                      ((member.bodovi*100)/numOfPoints) >= 0 && ((member.bodovi*100)/numOfPoints) <= 25 
                      ? 
                      "red" 
                      : 
                      ((member.bodovi*100)/numOfPoints)> 25 && ((member.bodovi*100)/numOfPoints) <= 50
                      ?
                      "orange"
                      :
                      ((member.bodovi*100)/numOfPoints) > 50 && ((member.bodovi*100)/numOfPoints) <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div> */

  return (
    <Dialog onClose={handleClose} open={open} style={{ color : darkMode ? "rgb(26,25,25)" : "white" }}>
      <DialogTitle style={{
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white": "black",
      }}>Members</DialogTitle>
      <DialogContent style={{ backgroundColor : darkMode ? "rgb(26,25,25)":"white"}}>
      <div style={{marginBottom: '30px',backgroundColor : darkMode ? "rgb(26,25,25)" :"white"}}>
      <ThemeProvider theme={theme}>
      <TextField defaultValue={props.imaTaskova? wholeValue: 0} onChange={ (e) => setWholeValue(parseInt(isNaN(parseInt(e.target.value))? 0 : parseInt(e.target.value))) }
                  sx= {{marginLeft: '50px', marginTop: '5px'}}  error={userError} id="outlined-basic" label="value" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary"/>
      <TextField defaultValue={suffix} onChange={ (e) => setSuffix(e.target.value) }
                  sx= {{marginLeft: '50px', marginTop: '5px'}}  error={userError} id="outlined-basic" label="suffix" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary"/>
      </ThemeProvider>
      </div>
      <List sx={{ 
        pt: 0 ,
        backgroundColor : darkMode ? "rgb(26,25,25)" : "white",
        color : darkMode ? "white" : "black",
        }}>
        {members.filter(member => member.korisnik.id!=JSON.parse(window.localStorage.getItem('user-info'))).map((member) => (
          <ListItem key={member.clanOrgID}>
            <ListItemAvatar>
              <Avatar src={"../../profile/"+member.korisnik.profilnaSlika} sx={{ bgcolor: blue[100], color: blue[600] }}>
              {member.korisnik.ime.slice(0,1)}{member.korisnik.prezime.slice(0,1)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.korisnik.korisnickoIme}/>
            <ListItemText primary={((member.bodovi*wholeValue)/numOfPoints).toFixed(0) + " " + suffix} sx= {{marginLeft: '30px'}}/>    
            <ThemeProvider theme={theme1}>
              <Button
                sx={{ border:"2px solid black", borderRadius:"10px", marginLeft: '50px'}}
                onClick={() => visitProfile(member.korisnik.id)}
                color="primary"
                variant="contained">
                View Profile
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

export default function ProgressBar(props) {

    const displej = ['inline','none']
    const [isVodja , setVodja] = React.useState(false)
    const [openSimple, setOpenSimple] = React.useState(false);

  async function vodjaStatus () {
    if(localStorage.getItem('clanTimaID')<=-1 || localStorage.getItem('clanTimaID')===null)
    {
      setVodja(true);
      return;
    }
    let rez = await fetch("https://localhost:5001/Tim/VratiVodjaStatus/" + localStorage.getItem('clanTimaID'),
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    rez = await rez.json();
    let vodja  = rez.vodja;
    setVodja(vodja);
 }

 React.useEffect(() => {
  vodjaStatus();
}, [props]);

  const theme = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(255, 255, 255)",
          },
          backgroundColor: "rgb(255, 255, 255)",
          float: 'right'
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
  
  const handleClickOpenSimple = () => {
    setOpenSimple(true);
  };

  const handleCloseSimple = (value) => {
    setOpenSimple(false);
  };
  
  return (
    <div>
        <AppBar position="static" className='upMenu' style={{ background: "rgb(17, 156, 151)" }}>
          <Toolbar className='upToolbar'>
            <div className='progressDiv' style={{ display:'flex', marginTop:'10px', marginBottom:'10px'}}>
                <Typography variant="h6" color="inherit" style={{ marginLeft:'10px'}}>
                Tasks done
                </Typography>
                <Typography  variant="h6" color="inherit" style={{ marginLeft:'5vw', display: isVodja? 'none' : 'inline'}}>
                Your effect: 
                </Typography>
                <div
                  style={{
                      width: props.procenat*0.3+"vw", 
                      border: "1px solid black", 
                      borderRadius:"10px",
                      height:"16px",
                      alignSelf:'center',
                      display: isVodja? 'none' : 'inline',
                      backgroundColor: 
                      props.procenat >= 0 && props.procenat <= 25 
                      ? 
                      "red" 
                      : 
                      props.procenat> 25 && props.procenat <= 50
                      ?
                      "orange"
                      :
                      props.procenat > 50 && props.procenat <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div>     
                 <Typography variant="h6" color="inherit" component="div" style={{ marginLeft:'20px', display: isVodja? 'none' : 'inline', alignSelf:'center' }}>
                      {parseInt(props.procenat)}%
                </Typography>
                {
                  isVodja?
                  <IconButton onClick={()=>handleClickOpenSimple()}>
                          <LeaderboardIcon sx={{width:'50px', height:'50px'}}/>
                  </IconButton>
                :
                null
                }
            </div>
              
            <div className='UpMenuBtnDiv'>
            </div>
          </Toolbar>
        </AppBar>
        {
        <SimpleDialog
                open={openSimple}
                onClose={handleCloseSimple}
                projID = {1}
                imaTaskova = {props.imaTaskova}
              />
        }
    </div>
  );
}
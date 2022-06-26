import React, {useEffect, useState} from "react";
import '../../styles/ProfileView/MyAccountForm.css';
import Avatar from '@mui/material/Avatar';
import { StyledBadge } from "./ProfileForm";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from "@mui/system";
import { createTheme, experimental_sx as sx } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function MyAccount() {


  const   token  = (JSON.parse(window.localStorage.getItem('user-info'))); 
  const [userID ,setUserID] = useState(null);

  useEffect(() => {

    fetch("https://localhost:5001/Korisnik/VratiIDKorisnika/"+token.value,
    {
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => {
        res.json()
        .then(data => {
            setUserID(data[0].id);
        });
    })
  },[])

  return(
    <div className="divProfileForm">
         {userID && <MyAccountForm userID={userID} />}
    </div>
   )
}
function MyAccountForm({userID}){

    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState(null);
    const   token  = (JSON.parse(window.localStorage.getItem('user-info'))); 
    const profileUserInfo = (JSON.parse(window.localStorage.getItem('ProfileUser-info')));
    const OrgID = (JSON.parse(window.localStorage.getItem('OrgID')));
    const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
    
    useEffect(() =>{

      if(profileUserInfo == userID){
        fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+token.value,
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
  
        fetch("https://localhost:5001/Projekat/VratiProjekteSaTaskovima/"+token.value,
          {
              method:"GET",
              headers: {
                  'Content-Type': 'application/json',
              },
          }).then(res => {
              res.json()
              .then(data => {
                  setProjects(data.filter(d => d.organizacijaID == OrgID && d.taskoviUradjeni.length != 0));
              });
          })
      }

      else{
        fetch("https://localhost:5001/Korisnik/VratiGledanogKorisnika/"+profileUserInfo,
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

      fetch("https://localhost:5001/Projekat/VratiProjekteSaTaskovima2/"+profileUserInfo,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            res.json()
            .then(data => {
              setProjects(data.filter(d => d.organizacijaID == OrgID && d.taskoviUradjeni.length != 0));
            });
        })
      }
    },[])

    return(
      <div className="divMyAccount">
          {projects && user && <MyAccount1 projects={projects} user={user} />}
      </div>
    )
}

function MyAccount1({projects, user}){
  
  const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));

    const theme = createTheme({
        components: {
            MuiButton: {styleOverrides:{
             root: {
              "&:hover": {
                backgroundColor: "rgb(31, 206, 206)",
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

    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [dialogTask, setDialog] = useState(0);
  
    const handleClickOpen = (scrollType, ind) => () => {
      setDialog(ind);
      setOpen(true);
      setScroll(scrollType);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);

    let procenat;

    function showEffect(taskoviUkupni, taskoviUradjeni){
        let ukupneVrednosti = taskoviUkupni.map(p => {return parseInt(p.vrednost)});
        let uradjeneVrednosti = taskoviUradjeni.map(p => {return parseInt(p.vrednost)});
        let ukupno = ukupneVrednosti.reduce((prev, curr) => prev + curr, 0);
        let uradjeno = uradjeneVrednosti.reduce((prev, curr) => prev + curr, 0);
        let procenat = (uradjeno/ukupno*100).toFixed(0);
        return procenat;
    }
    
    return(
        <Grid container>
          <Grid item xs={12} sm={12} md={10}>
            <div className="Information">
                <div className="divAvatarMyAccount">
                <StyledBadge
                 overlap="circular"
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                 variant="dot"
                >
                     <Avatar 
                      sx={{width:"100px", height:"100px", fontSize:"40px"}}
                      src={"../../profile/"+user[0].profilnaSlika}
                      >{user[0].ime.charAt(0)}{user[0].prezime.charAt(0)}</Avatar>
               </StyledBadge>
            </div>
            <div className="Name">
                <h2 className="h2FirstLastName">{user[0].ime} {user[0].prezime}</h2>
            </div>
            <div className="divUsername">
                <h3 className="h3UserName">{user[0].korisnickoIme}</h3>
            </div>
            <div className="divEmail">
                <h3 className="h3Email">{user[0].email}</h3>
            </div>
            <div className="divNumber">
                <h3 className="h3Phone">{user[0].brtelefona}</h3>
            </div>
        </div>
        </Grid>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {projects.map((project, index) => (
        <React.Fragment key={project.id}>
           <Grid item md={4} sm={6} xs={12}>     
            <Box sx={{margin:"0.5%" }}
            >
            <Card variant="outlined" 
            sx={{backgroundColor:"#d6e9de", boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)"}}
            >
                <CardContent>
                <Typography variant="h5" component="div" key={project.id.toString()}>
                    {"Name: " + project.naziv}
                </Typography>
                <Typography sx={{ fontSize: 14, height: "8vh", overflow: "auto" }} color="text.secondary" gutterBottom key={(project.id+1).toString()}>
                     {"Descripiton: " + project.opis}
                </Typography>
                  <Typography sx={{ mb: 1.5, fontSize:14 }} color="text.secondary" key={(project.id+2).toString()}>
                  Effect {procenat = showEffect(project.taskoviUkupni, project.taskoviUradjeni)}%
                  </Typography>
                  <div
                  style={{
                      width: procenat+"%", 
                      border: "1px solid black", 
                      borderRadius:"10px",
                      height:"4px",
                      backgroundColor: 
                      procenat >= 0 && procenat <= 25 
                      ? 
                      "red" 
                      : 
                      procenat> 25 && procenat <= 50
                      ?
                      "orange"
                      :
                      procenat > 50 && procenat <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div>    
              </CardContent>
              <CardActions>
          <ThemeProvider theme={theme}>
              <Button
              variant="contained" 
              onClick={handleClickOpen("paper", index)}
              sx={{height:"30px", border:"2px solid black", borderRadius:"10px"}}
              color="primary">
               See Tasks
             </Button>
           </ThemeProvider>
            </CardActions>
            </Card>
            </Box> 
        </Grid>
    </React.Fragment>
        ))}
        <Dialog
              open={open}
              onClose={handleClose}
              scroll={scroll}
              aria-labelledby={"scroll-dialog-title"}
              aria-describedby="scroll-dialog-description"
              >
              <DialogTitle id="scroll-dialog-title" style={{
                backgroundColor : darkMode ? "rgb(26,25,25)" :"azure",
                color : darkMode ? "white" : "black",
              }} >{projects[dialogTask] != null ? projects[dialogTask].naziv : null}</DialogTitle>
              <DialogContent dividers={scroll === 'paper'} style={{
                backgroundColor : darkMode ? "rgb(26,25,25)" :"azure",
                color : darkMode ? "white" : "black",
              }} >
                    {projects[dialogTask] != null ? projects[dialogTask].taskoviUradjeni.map(task => 
                    (<DialogContentText
                    key={task.id}
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    sx={{color : darkMode ? "white" : "black"}}>
                    {task.naziv + ": " + task.opis + ". (" + "type: " + task.tip + ", " + "points: " + task.vrednost + ")"}
                    </DialogContentText>)) : null}
                </DialogContent>
                <DialogActions style={{
                    backgroundColor : darkMode ? "rgb(26,25,25)" :"azure",
                    color : darkMode ? "white" : "black",
                }}>
                <ThemeProvider theme={theme}>
                <Button variant="contained" onClick={handleClose} color="primary">
                  ok
                </Button>
                </ThemeProvider>
                </DialogActions>
             </Dialog>
     </Grid>
    </Grid>
    )
}

export default MyAccount;



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
import Popover from '@mui/material/Popover';
import {ThemeProvider} from "@mui/system";
import { createTheme, experimental_sx as sx } from "@mui/material/styles";

import Grid from '@mui/material/Grid';

function MyAccountForm(){

    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://localhost:5001/Projekat/VratiProjekteSaTaskovima/"+2,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            res.json()
            .then(data => {
                setProjects(data);
            });
        })
    }, [])

    useEffect(() =>{
        fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+1,
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

    return(
        <div className="divMyAccount">
             {user && projects && <MyAccount1 projects={projects} user={user} />}
        </div>
    )
}

function MyAccount1({projects, user}){

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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
          <Grid item xs={8} sm={8} md={10}>
            <div className="Information">
                <div className="divAvatarMyAccount">
                <StyledBadge
                 overlap="circular"
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                 variant="dot"
                >
                     <Avatar 
                      sx={{width:"100px", height:"100px"}}>
                    </Avatar>
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
            {/*<div className="divCards">*/}
            {projects.map(project => (
           <Grid item md={4} sm={6} xs={12}>     
            <Box key={project.id} sx={{margin:"0.5%" }}>
            <Card key={project.id} variant="outlined" 
            sx={{backgroundColor:"#d6e9de", boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)"}}>
                <CardContent>
                <Typography variant="h5" component="div">
                    {"Name: " + project.naziv}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                     {"Descripiton: " + project.opis}
                </Typography>
                  <Typography sx={{ mb: 1.5, fontSize:14 }} color="text.secondary">
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
              aria-describedby={id}
              variant="contained" 
              onClick={handleClick}
              sx={{height:"30px", border:"2px solid black", borderRadius:"10px"}}
              color="primary">
               See Tasks
             </Button>
           </ThemeProvider>
           <Popover
             id={id}
             open={open}
             anchorEl={anchorEl}
             onClose={handleClose}
             anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
           }}
           > 
        {project.taskoviUradjeni.map(task => (<Typography key={task.id} sx={{ p: 2 }}> {task.naziv + ": " + task.opis} </Typography>))}
      </Popover>
            </CardActions>
            </Card>
            </Box> 
        </Grid>))}
        {/*</div>*/}
     </Grid>
    </Grid>
    )
}

export default MyAccountForm;



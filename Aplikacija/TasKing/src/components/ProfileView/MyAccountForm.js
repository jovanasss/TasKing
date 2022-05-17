import React from "react";
//import '../styles/ProfileView/MyAccountForm.css';

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
import { createTheme, experimental_sx as sx } from "@mui/material/styles"

function MyAccountForm(){

    const theme = createTheme({
        components: {
            MuiButton: {styleOverrides:{
             root: {
              "&:hover": {
                backgroundColor: "rgb(0, 120, 0)",
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

    const projects = [
        {
            id:0,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"1%"
        },
        {
            id:1,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"50%"
        },
        {
            id:2,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"20%"
        },
        {
            id:3,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"70%"
        },
        {
            id:4,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"20%"
        },
        {
            id:5,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"78%"
        },
        {
            id:6,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"20%"
        },
        {
            id:7,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"100%"
        },
        {
            id:8,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"45%"
        },
        {
            id:9,
            naziv:"TasKing",
            opis:"Nice project",
            procenat:"13%"
        }
    ]

    const tasks = [
        {
            naziv:"Login form"
        },
        {
            naziv:"Create account form"
        },
        {
            naziv:"My profile form"
        }
    ]

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
        <div className="divMyAccount">
            <form>
            <div className="Information">
                <div className="divAvatarMyAccount">
                <StyledBadge
                 overlap="circular"
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                 variant="dot"
                >
                     <Avatar 
                      sx={{width:"80px", height:"80px"}}>
                    </Avatar>
               </StyledBadge>
            </div>
            <div className="Name">
                <h2>FirstName LastName</h2>
            </div>
            <div className="divUsername">
                <h3>Username</h3>
            </div>
            <div className="divNumber">
                <h3>Number</h3>
            </div>
        </div>
        
            <div className="divCards">
            {projects.map(project => (
            <Box sx={{ minWidth: 280, maxWidth: 340 ,margin:"0.5%" }}>
            <Card variant="outlined" 
            sx={{backgroundColor:"#d6e9de", boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)"}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                    {"Name:" + project.naziv}
                   </Typography>
                   <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                     {"Descripiton: " + project.opis}
                  </Typography>
                  <Typography sx={{ mb: 1.5, fontSize:14 }} color="text.secondary">
                    Effect {project.procenat}
                  <div
                  style={{
                      width: project.procenat, 
                      border: "1px solid black", 
                      height:"4px",
                      backgroundColor: 
                      parseInt(project.procenat) > 0 && parseInt(project.procenat) <= 25 
                      ? 
                      "red" 
                      : 
                      parseInt(project.procenat) > 25 && parseInt(project.procenat) <= 50
                      ?
                      "orange"
                      :
                      parseInt(project.procenat) > 50 && parseInt(project.procenat) <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div>    
            </Typography>
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
        {tasks.map(task => (<Typography sx={{ p: 1 }}> {task.naziv} </Typography>))}
      </Popover>
            </CardActions>
            </Card>
            </Box> ))}
        </div>
    </form>
</div>
    )
}

export default MyAccountForm;


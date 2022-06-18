import '../../styles/ProfileView/ProfileForm.css';
import * as React from 'react';
import {useEffect, useState} from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import MyAccountForm from "./MyAccountForm";
import EditAccountForm from "./EditAccountForm";
import RequestsForm from "./RequestsForm";
import LoginForm from "../Forms/LoginForm.js";
import { createTheme } from "@mui/material/styles";
import {fontWeight, ThemeProvider} from "@mui/system";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppBar from '@mui/material/AppBar';

const drawerwidth = 240;
const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
document.body.style.backgroundColor = darkMode ? "rgb(46, 45, 45)" :"azure";

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgb(26, 167, 167)"
        }
      }
    }
  },
  MuiButton: {styleOverrides:{
    root: {
     "&:hover": {
       backgroundColor: "rgb(31, 206, 206)",
     },
    }
   }
  },
  palette: {
    primary: {
      main: "#d6e9de",
    },
    secondary:{
      main : "rgb(26, 167, 167)",
    }
  },
});

const theme1 = createTheme({
  palette: {
    primary: {
      main: "#F57878",
    },
    secondary:{
      main : "rgb(0, 0, 0)",
    }
  },
})

function ProfileForm(){

  const [user, setUser] = useState(null);
  const korisnikID = window.localStorage.getItem('ProfileUser-info');

  const userInfo = (JSON.parse(window.localStorage.getItem('user-info')));
  const profileUserInfo = (JSON.parse(window.localStorage.getItem('ProfileUser-info')));

  useEffect(() =>{
    
    if(profileUserInfo == userInfo.id){
      fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+userInfo.id,
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
  }
  else{
    fetch("https://localhost:5001/Korisnik/VratiKorisnika/"+profileUserInfo,
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
  }
}, [])

if(profileUserInfo == userInfo.id){
  return(
    <div className="divProfileForm">
         {user && <ProfileForm1 user={user} />}
    </div>
   )
}

else{
  return(
    <div className="divProfileForm">
         {user && <ProfileForm2 user={user} />}
    </div>
   )
  }
}

function ProfileForm1({user}){
  
  const [mobileOpen, setMobileOpen] = React.useState(false);

      const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

      const [open, setOpen] = React.useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const navigate = useNavigate();
      const location = useLocation();

      const items = [
        {
          id: 0,
          text: <label style={{fontWeight:"bold"}}>My Account</label>,
          icon: <ThemeProvider theme={theme}>
                  <AccountCircleIcon color= "primary" />
                </ThemeProvider>,
          path: ""
        },
        {
          id: 1,
          text: <label style={{fontWeight:"bold"}}>Edit Account</label>,
          icon: <ThemeProvider theme={theme}>
                   <EditIcon color="primary" />
                </ThemeProvider>,
          path: "editaccount"
        },
        {
          id: 2,
          text: <label style={{fontWeight:"bold"}}>Requests</label>,
          icon: <ThemeProvider theme={theme}>
                   <GroupAddIcon color="primary" />
                </ThemeProvider>,
          path: "requests"
        }
      ]
     const item = {
          text:  <label style={{fontWeight:"bold", marginRight: "8%"}}>Log Out</label>,
          icon: <ThemeProvider theme={theme}>
                  <LogoutIcon color="primary" />
                </ThemeProvider>,
          path: "/"
      }

      function logOut(){
        navigate("/");
        localStorage.removeItem("user-info");
        localStorage.removeItem("rememberMe");
      }
      
      const drawer = (
        <div>
        <div className='divAvatar'>
               <div className="divButtonBackToMain">
               <ThemeProvider theme={theme}>
                 <Button 
                 variant="contained" 
                 color="secondary" 
                 startIcon={ <ThemeProvider theme={theme}><ArrowBackIcon color="primary" /></ThemeProvider>}
                 onClick={() => navigate("/Main")}></Button>
                </ThemeProvider>
               </div>
                <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                >
                 <Avatar sx={{width:"50px", height:"50px"}} src={"../../profile/"+user[0].profilnaSlika}>{user[0].ime.charAt(0)}{user[0].prezime.charAt(0)}</Avatar>
               </StyledBadge>
               <div>
                 <h3 className="h3FirstName">{user[0].ime}</h3>
                 <h5 className="h5UserName">{user[0].korisnickoIme}</h5>
               </div>
            </div>
              <List>
               {items.map(item => (
                <ListItem
                 key={item.id}
                 button
                 onClick={() => navigate(item.path)}
                 className={location.pathname == "/Profile" + item.path ? "active" 
                 : location.pathname == "/Profile/" + item.path ? "active" : null}
               >
                   <ListItemIcon>{item.icon}</ListItemIcon>
                   <ListItemText primary={item.text} />
                 </ListItem>
               ))}
              </List>
              <div className="divButtonLogOut">
              <ThemeProvider theme={theme}>
              <Button 
              variant="contained"
              color="secondary"
              sx={{width:"100%"}}
              onClick={handleClickOpen}>
                {item.text} {item.icon}
              </Button>
              </ThemeProvider>
              </div>
              <Dialog
               open={open}
               onClose={handleClose}
               aria-labelledby="alert-dialog-title"
               aria-describedby="alert-dialog-description"
              >
              <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold" , backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                {"Log Out"}
              </DialogTitle>
              <DialogContent style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
              <DialogContentText id="alert-dialog-description" style={{backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black" }}>
                Are you sure you want to logout?
              </DialogContentText>
            </DialogContent>
              <DialogActions style={{ backgroundColor : darkMode ? "rgb(26,25,25)": "white" , color : darkMode ? "white" : "black"}}>
                 <ThemeProvider theme={theme1}><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                 <ThemeProvider theme={theme1}>
                   <Button variant="contained" onClick={logOut} color="primary" sx={{fontWeight:"bold"}} autoFocus>
                     Log Out
                   </Button></ThemeProvider>
            </DialogActions>
          </Dialog>
      </div>
      )

      return (
      <div>
        <AppBar
        position="fixed"
        sx={{
          backgroundColor:"transparent",
          boxShadow:"0px 0px 0px 0px",
          color:"black"
        }}
      >
         <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'block', md: 'block', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
        {/*<Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'block', md: 'block', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
      </Toolbar>*/}
      <ThemeProvider theme={theme}>
      <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md:'none'},
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerwidth },
          }}
        >
         {drawer}
        </Drawer>
       <Drawer 
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'none', md:'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerwidth },
        }}
        open
        >
           {drawer}
          </Drawer>
          </ThemeProvider>
          <div className="divRoutes">
            <Routes>
                <Route path="" element={<MyAccountForm />} />
                <Route path="editaccount" element={<EditAccountForm />} />
                <Route path="/" element={<LoginForm />} />
                <Route path="requests" element={<RequestsForm />} />
            </Routes>
          </div>
     </div>
      );
}

function ProfileForm2({user}){

  const [mobileOpen, setMobileOpen] = React.useState(false);

      const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

      const navigate = useNavigate();
      const location = useLocation();

  const item = {
    id: 0,
    text: <label style={{fontWeight:"bold"}}>My Account</label>,
    icon: <ThemeProvider theme={theme}>
                <AccountCircleIcon color= "primary" />
          </ThemeProvider>,
    path: ""
  }

  const drawer = (
    <div>
    <div className='divAvatar1'>
           <div className="divButtonBackToMain">
           <ThemeProvider theme={theme}>
             <Button 
             variant="contained" 
             color="secondary" 
             startIcon={ <ThemeProvider theme={theme}><ArrowBackIcon color="primary" /></ThemeProvider>}
             onClick={() => navigate("/Main")}></Button>
            </ThemeProvider>
           </div>
            <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            >
             <Avatar sx={{width:"50px", height:"50px"}} src={"../../profile/"+user[0].profilnaSlika}>{user[0].ime.charAt(0)}{user[0].prezime.charAt(0)}</Avatar>
           </StyledBadge>
           <div>
             <h3 className="h3FirstName">{user[0].ime}</h3>
             <h5 className="h5UserName">{user[0].korisnickoIme}</h5>
           </div>
        </div>
          <List>
            <ListItem
             key={item.id}
             className={location.pathname == "/Profile" + item.path ? "active" 
             : location.pathname == "/Profile/" + item.path ? "active" : null}
           >
               <ListItemIcon>{item.icon}</ListItemIcon>
               <ListItemText primary={item.text} />
             </ListItem>
          </List>
  </div>
  )

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor:"transparent",
          boxShadow:"0px 0px 0px 0px",
          color:"black"
        }}
      >
         <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'block', md: 'block', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/*<Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'block' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>*/}
    <ThemeProvider theme={theme}>
    <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'block', md:'none'},
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerwidth },
        }}
      >
       {drawer}
      </Drawer>
     <Drawer 
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'none', md:'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerwidth },
      }}
      open
      >
         {drawer}
        </Drawer>
        </ThemeProvider>
        <div className="divRoutes">
          <Routes>
              <Route path="" element={<MyAccountForm />} />
          </Routes>
        </div>
   </div>
    );
}

export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 0,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

export default ProfileForm;

import '../../styles/ProfileView/ProfileForm.css';
import * as React from 'react';
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

const drawerwidth = 240;

function ProfileForm(){

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

  const items = [
    {
      text: <label style={{fontWeight:"bold"}}>My Account</label>,
      icon: <ThemeProvider theme={theme}>
              <AccountCircleIcon color= "primary" />
            </ThemeProvider>,
      path: ""
    },
    {
      text: <label style={{fontWeight:"bold"}}>Edit Account</label>,
      icon: <ThemeProvider theme={theme}>
               <EditIcon color="primary" />
            </ThemeProvider>,
      path: "editaccount"
    },
    {
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

      return (
      <div>
      <ThemeProvider theme={theme}>
       <Drawer 
        variant="permanent"
        sx={{width: drawerwidth}}
        >
        <div className='divAvatar'>
            <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            >
             <Avatar></Avatar>
           </StyledBadge>
           <div>
             <h3 className="h3FirstName">FirstName</h3>
             <h5 className="h5UserName">Username</h5>
           </div>
        </div>
          <List>
           {items.map(item => (
            <ListItem
             key={item.text}
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
         
          <ThemeProvider theme={theme}>
          <Button 
          variant="contained"
          color="secondary"
          sx={{boxShadow:"0 8px 16px 0 rgba(0,0,0,0.4), 0 6px 20px 0 rgba(0,0,0,0.19)", marginTop: "258%"}}
          onClick={handleClickOpen}>
            {item.text} {item.icon}
          </Button>
          </ThemeProvider>
          <Dialog
           open={open}
           onClose={handleClose}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title"  sx={{fontWeight:"bold"}}>
            {"Log Out"}
          </DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
          <DialogActions>
             <ThemeProvider theme={theme1}><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
             <ThemeProvider theme={theme1}>
               <Button variant="contained" onClick={() => navigate(item.path)} color="primary" sx={{fontWeight:"bold"}} autoFocus>
                 Log Out
               </Button></ThemeProvider>
        </DialogActions>
      </Dialog>
    
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

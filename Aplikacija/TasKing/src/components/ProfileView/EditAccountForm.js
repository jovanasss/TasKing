import React from "react";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles";
import { TextField } from "@mui/material";
import '../../styles/ProfileView/EditAccountForm.css';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';

function EditAccountForm(){

        const theme = createTheme({
            components:{
              MuiTextField : {styleOverrides:{
                  root : sx ({
                    "& .MuiOutlinedInput-root": {
                        "& > fieldset": {
                          borderColor: "rgb(0, 100, 100)",
                        },
                    ":hover"  :{
                        "& > fieldset": {
                            borderColor: "rgb(0, 100, 100)",
                          },
                    }  
                    }
                  })
              }},  
              MuiButton: {styleOverrides:{
                root: {
                 "&:hover": {
                   backgroundColor: "rgb(31, 206, 206)",
                 },
                }
               }},
               MuiAvatar: {styleOverrides:{
                root: {
                 "&:hover": {
                   backgroundColor: "rgb(31, 206, 206)",
                   cursor: "pointer"
                 },
                }
               }}
            },
            palette: {
              primary: {
                main: "rgb(0, 100, 100)",
              },
              secondary:{
                main : "rgb(0, 100, 0)",
              }
            },
          });

          const [open, setOpen] = React.useState(false);

          const handleClickOpen = () => {
            setOpen(true);
          };
        
          const handleClose = () => {
            setOpen(false);
          };

        return (
            <div className="divMainEditAccount">

                    <div className="LeviDivEditAccount">
                        <div className="divInputFirstName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value="Pavle" variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                        <div className="divInputLastName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value="Zivanovic" variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                       <div className="DivEditUserName"> 
                        <div className="divInputUserName">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" label="Username" variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }}/> 
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained">Edit</Button>
                        </ThemeProvider>
                       </div> 

                        <div className="divInputEmail">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" value="pavle123@gmail.com" variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }} disabled/> 
                                </ThemeProvider>
                        </div>

                        <div className="DivEditPhone"> 
                        <div className="divInputPhone">
                                <ThemeProvider theme={theme}>
                                    <TextField id="outlined-basic" label="Phone Number" variant="outlined" type="number" color="primary" sx ={{ width: "85%"  }}/> 
                                </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                        <Button sx={{height:"40px", width: "40px", border:"2px solid black", borderRadius:"10px", marginTop:"12%"}}
                        variant="contained">Edit</Button>
                        </ThemeProvider>
                        </div>

                        </div>

                      <div className="DivButtonChangePassword">
                        <ThemeProvider theme={theme}>
                           <Button 
                           onClick={handleClickOpen} 
                           variant="contained"
                           sx={{height:"80px", width: "190px", border:"2px solid black", borderRadius:"10px", marginTop: "10%", marginRight:"47%"}}
                           color="primary">
                             Change password
                          </Button>
                          </ThemeProvider>
                           <Dialog open={open} onClose={handleClose}>
                             <DialogTitle>Update your password</DialogTitle>
                             <DialogContent>
                            <DialogContentText>
                             Enter your current password and a new password.
                           </DialogContentText>
                         <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Current Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                          <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          variant="standard"
                          />
                       </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleClose}>Done</Button>
                    </DialogActions>
                    </Dialog>
                  </div>

                <div className="DesniDivEditAccount">
                  <div className="divAvatarEditAccount">
                            <ThemeProvider theme={theme}>
                            <Tooltip title={<h1 style={{color:"rgb(31, 206, 206)"}}>Click to change photo</h1>} placement="top" sx={{fontSize:"20px"}}>
                            <Avatar sx={{width: "150px", height:"150px"}} onClick={()=> alert("change photo")}></Avatar>
                            </Tooltip>
                            </ThemeProvider>
                  </div>
                  <div >
                 
                </div>


                </div>

            </div>
        )
}

export default EditAccountForm;
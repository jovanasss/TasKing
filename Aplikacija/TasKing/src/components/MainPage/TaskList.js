//import '../styles/MainPage/TaskList.css';
import React, { Component, useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, createTheme, IconButton} from '@mui/material';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
const drawerWidth = 240

function Tasks(props)
{
  
  const theme = createTheme({
    components: {
        MuiButton: {styleOverrides:{
         root: {
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

const [open, setOpen] = React.useState(false);
const [scroll, setScroll] = React.useState('paper');
const [dialogTask, setDialog] = React.useState(0);

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

const tekstoviClan = ["I'm intreseted", "Cancel", "Done", ""]
const tekstoviVodja = ["Edit", "Pick", "", "Review"]
const tekstovi = [tekstoviClan, tekstoviVodja]
const displejClan = ['inline', 'inline', 'inline', 'none', 'none']
const displejVodja = ['inline', 'inline', 'none', 'inline', 'none']
const displej = [displejClan, displejVodja]
const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
const boje = ['rgb(255, 255, 255)', 'rgb(255, 207, 49)', 'rgb(77, 154, 255)', 'rgb(78, 255, 93)']

if(props.taskovi==undefined || props.taskovi==null)
  return;

if(props.taskovi.length == 0)
  return;

return(
      <div className="divTasks">
              {props.taskovi.filter(task => (task.status==props.selected-1 || (props.selected==0 && task.status<4))).map((task, index) => (
              <Box sx={{ minWidth: 280, maxWidth: 340 ,margin:"0.5%" }}>
                <Card variant="outlined" 
                  sx={{boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)", backgroundColor:boje[task.status], marginBottom:'10px' }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {task.naziv.slice(0,70) + (task.naziv.length>70? "..." : "")}
                      </Typography>
                      <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                        {"Descripiton: " + task.opisTaska.slice(0,150) + (task.opisTaska.length>150? "..." : "")}
                      </Typography>
                      <Typography sx={{ mb: 1.5, fontSize:15 , fontWeight: 'bold' }} color="text.primary">
                        poeni: {task.vrednost} 
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <ThemeProvider theme={theme}>
                      <Button
                          onClick={handleClickOpen('paper', index)} 
                          //aria-describedby={id} 
                          variant="contained" 
                          //onClick={handleClick}
                          sx={{ border:"2px solid black", borderRadius:"10px"}}
                          color="primary">
                          See more
                        </Button>
                        <Button 
                          //aria-describedby={id} 
                          variant="contained" 
                          //onClick={handleClick}
                          sx={{ border:"2px solid black", borderRadius:"10px", display: displej[props.vodjaStatus][task.status]}}
                          color="primary">
                            {tekstovi[props.vodjaStatus][task.status]}
                        </Button>
                      </ThemeProvider> 
                    </CardActions>
                </Card>
              </Box>
              
               ))}
              <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby={"scroll-dialog-title"}
                aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title">{props.taskovi[dialogTask].naziv}</DialogTitle>
                  <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                      id="scroll-dialog-description"
                      ref={descriptionElementRef}
                      tabIndex={-1}>
                      {props.taskovi[dialogTask].opisTaska}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose}>ok</Button>
                  </DialogActions>
              </Dialog>
    </div>
)
}


function TaskList(props){
  
    const theme = createTheme({
      components: {
          MuiButton: {styleOverrides:{
           root: {
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

  const displejPlus = ['none', 'inline']

  return(
        <div className="divTasks">
                <Box className='addBtnBox' sx={{margin:"0.5%", display: displejPlus[props.vodjaStatus] }}>
                  <Card variant="outlined" 
                    className='addCard'
                    sx={{minWidth: 250, maxWidth: 340, minHeight: 250, maxHeight: 340, boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)"}}>
                      <CardContent>
                      </CardContent>
                      <CardActions>
                        <ThemeProvider theme={theme}>
                          <IconButton className='addBtn'>
                            <AddIcon sx={{minWidth: 150, maxWidth: 300, minHeight: 150, maxHeight: 300}}/>
                          </IconButton>
                        </ThemeProvider> 
                      </CardActions>
                  </Card>
                </Box>
                <Tasks selected={props.selected} vodjaStatus={props.vodjaStatus} taskovi = {props.taskovi}/>
      </div>
)
}

export default TaskList;

import React, { Component, useState }  from "react";
import * as ReactDOMClient from 'react-dom/client';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField , Box, Button, Dialog, DialogTitle , DialogContent ,DialogContentText,DialogActions } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { renderMatches, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ListItemButton } from "@mui/material";
import { ClassNames } from "@emotion/react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import App from "../../App";

function CreateTeamTasks(){


    // konstante  za cuvanje inputa 
    const [openD, setOpenD] = useState(false)
    const [taskName , setTaskName] = useState('')
    const [bodovi , setBodovi] = useState('')
    const [projName , setProjName] = useState('')
    const [projNameError, setProjNameError] = useState(false)
    const [projDesc , setProjDesc] = useState('')
    const [projDescError, setProjDescError] = useState(false)

    /*
    Jos uvek nisam siguran kako ovaj deo da resim 
    const [task , setTask] = useState('')
    const [taskList , setTaskList] = useState('')
    */




    // otvaranje i zatvaranje Dijaloga 
    const handleClick = () => {
        setOpenD(true);
    }
    const handleClose = () => {
        setOpenD(false)
    }


    // error check => napraviNoviTask(Naslov , bodovi) && dodavnje u taskList parent Projekta
    const handleSubmit = () => {
        setOpenD(false)
        console.log(taskName , bodovi)
        const root = ReactDOMClient.createRoot(document.getElementById('inputTasks'))
        const element = 
        <div className="taskovi">
        <List>
            <ListItemButton component="a" href="#simple-list">
                <ListItemText primary={taskName} secondary={bodovi} />
                <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                </IconButton>
            </ListItemButton>
        </List>
        </div>
        root.render(element)
    }


    // error check => napraviNoviprojekat(Naslov, opis , listaTaskova[])
    const handleProjectCreation = () =>{

        if (projName === ''){
            setProjNameError(true)
        }
        if (projDesc === ''){
            setProjDescError(true)
        }

        // ako je sve ok napravi projekat
        if (projName && projDesc){
            
            // napraviNoviprojekat(Naslov, opis , listaTaskova[])
            console.log(projName , projDesc)
            routeChange()
        }

    }


    let navigate = useNavigate();
    // promena strane
    const routeChange = () =>{ 
      let path = `/Main`; 
      navigate(path);
    }


    // kreiranje mui teme
    const theme = createTheme({
        components:{
          MuiTextField : {styleOverrides:{
              root : sx ({
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      //borderColor: "rgb(161, 17, 161)",
                      borderColor: "rgb(0, 100, 100)",
                    },
                ":hover"  :{
                    "& > fieldset": {
                        //borderColor: "rgb(161, 17, 161)",
                        borderColor: "rgb(0, 100, 100)",
                      },
                }  
                }
              })
          }},
          MuiButton: {styleOverrides:{
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
            main : pink[100],
          }
        },
      });



    return (
        <div className="divMainTeamTasks">

            <form className="formaCreateTeamTasks">
                <div className="GlavniDivTeamTasks">
                        <div className="divNaslovCreateTeamTasks"> 
                            <label className="naslovCreateTeamTasks">CREATE A PROJECT</label>
                        </div>
                        <div className="inputProjectTitle">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setProjName(e.target.value) } error={projNameError}
                                 id="outlined-basic" label="Project Title" variant="outlined"  type="text" color="primary" maxRows ={'1'} required sx={{width :"85%"}}/>
                            </ThemeProvider>
                        </div>
                        <div className="inputProjectDescription">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setProjDesc(e.target.value) } error={projDescError}
                                id="outlined-basic" label="Description"  variant="outlined"  type="text" color="primary" 
                                multiline 
                                required
                                rows={'5'}
                                //maxRows={'5'}  
                                sx={{ width : "85%", height: "40%"}}/>
                            </ThemeProvider>
                        </div>
                        <div id="inputTasks" className="inputTasks">

                        </div>
                        <div>
                            <ThemeProvider theme={theme}>
                                <Dialog open={openD} onClose={handleClose}>
                                    <DialogTitle>
                                            Define your task and its value 
                                    </DialogTitle>
                                    <DialogContent>
                                        <ThemeProvider theme={theme}>
                                            <TextField id="outlined-basic" label="Task Title" variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                                            onChange={(e) => setTaskName(e.target.value)}
                                            sx={{
                                                width :"100%",
                                                marginTop : "5%",
                                                marginBottom : "5%",
                                                }}/>                      
                                        </ThemeProvider>
                                        <ThemeProvider theme={theme}>
                                            <Slider 
                                            value = {bodovi}
                                            onChange={(e ,value ) => setBodovi(value)}
                                            defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                                        </ThemeProvider>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={handleSubmit}>Sumbit</Button>
                                    </DialogActions>
                                </Dialog>
                            </ThemeProvider>
                        </div>
                        <ThemeProvider theme={theme}>
                            <Button 
                            onClick={handleClick}
                            sx ={{
                                border: 2,
                                borderColor:"text.primary",
                                display: "flex",
                                flexDdirection: "column",
                                width: "40%",
                                height: "10%",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "16px",
                                fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                                /*background-color: rgb(161, 17, 161);*/
                                backgroundColor: "rgb(0, 100, 100)",
                                color: "aliceblue",
                                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2) 0 6px 20px 0 rgba(0,0,0,0.19)",
                                marginLeft: "30%",
                                marginRight: "30%",
                                marginTop : "2%",
                                borderRadius: "25px",
                            }}
                            startIcon = {<AddCircleIcon/>}
                            >Add Tasks</Button>
                        </ThemeProvider>
                        <button onClick={(event) => { event.preventDefault() ; handleProjectCreation(); } } className="BtnFinishTeamTasks">FINISH</button>
                        
                </div>
            </form>
        </div>
    )


}



export default CreateTeamTasks ;
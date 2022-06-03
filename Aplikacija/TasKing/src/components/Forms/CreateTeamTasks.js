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
import Task from "../../Classes/TaskDTO";
import TaskList from "../MainPage/TaskList";
import Grid from '@mui/material/Grid';



function CreateTeamTasks(){


    // konstante  za cuvanje inputa 
    const [openD, setOpenD] = useState(false)
    const [taskName , setTaskName] = useState('')
    const [taskType , setTaskType] = useState('')
    const [taskDesc ,setTaskDesc] = useState('')
    const [bodovi , setBodovi] = useState('')
    const [projName , setProjName] = useState('')
    const [projNameError, setProjNameError] = useState(false)
    const [projDesc , setProjDesc] = useState('')
    const [projDescError, setProjDescError] = useState(false)


    const [tasks , setTasks] = useState([])
    



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
        let task = {
            naziv: taskName ,
            tip : taskType ,
            opis : taskDesc ,
            bodovi : bodovi
        };
        let arr = tasks.concat(task);
        setTasks(arr);
        console.log(arr);

       // const t = new Task(bodovi,taskName);

       // const element = 

       //root.render(element);
    }

    async function createProject(){


        // let timID = localstorage.GetItem("timID"); 



        const idTima = (JSON.parse(window.localStorage.getItem('clanTimaID')));
        console.log(idTima);



        const projekat = {
            naziv : projName,
            opis : projDesc,
            //taskovi : tasks
            timID : idTima,
        }
        console.log(projekat);

        if ( tasks.length !== 0){

            let rezultat = await fetch("https://localhost:5001/Projekat/KreirajProjekat/", {
                method : 'POST',
                headers : {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Accept': 'application/json; charset=utf-8'
                },
                body : JSON.stringify(projekat)
              });
              let status = rezultat.status;
              let idProjekta = await rezultat.json();
    
              // dodati idProjekta u niz taskova i proslediti kroz body fetcha 
              // za svaki task mora da se doda novi prop idProjekta vrv preko map f-je i onda se vrti foreach sa ovim fetchom ispod
     
             /* tasks.map((task)=> {
                niz[task] = Object.assign(tasks[task] , idProjekta);
             })*/
    
             console.log(tasks);
             // dodajemo prop idProjekta 
             tasks.forEach((element) => {
                element.projekatID = idProjekta
              });
    
              console.log(tasks)
              
    
              console.log(status);
    
              // ako je ok dodajemo taskove 
              if (status === 200){
    
                tasks.map(async task => {
                    let result = await fetch("https://localhost:5001/Task/KreirajTask/", {
                        method : 'POST',
                        headers : {
                          'Content-Type': 'application/json; charset=utf-8',
                          'Accept': 'application/json; charset=utf-8'
                        },
                        body : JSON.stringify(task)
                      });
                      let statusT = result.status;
                      if ( statusT === 200){
                          routeChange();
                      }
                })
              }
              else {
    
                    // prikaz greske 
                  console.log(status);
              }

        }
        else {
            console.log("Niste dodali taskove")
        }



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
            //console.log(projName , projDesc , tasks);

            createProject();
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
            <div>
                Kurcina brate             
            </div>
            <Grid container>
            <Grid item  xs={0} sm={2} md={4}>
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
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
                        <div id="inputTasks" className="inputTasks" rows={'5'} multiline = "true" >
                            <List style={{maxHeight: '85%', overflow: 'auto'}} >
                                 {tasks.map(task => 
                            <ListItem>             
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemText primary={task.naziv} secondary={task.bodovi} />
                                <IconButton edge="end" aria-label="delete" onClick={() => tasks.filter((a) => a === task) }>
                                <DeleteIcon />
                                    </IconButton>
                            </ListItemButton>
                            </ListItem>   )}                   
                            </List>
 
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
                                            <TextField id="outlined-basic" label="Task Type" variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                                            onChange={(e) => setTaskType(e.target.value)}
                                            sx={{
                                                width :"100%",
                                                marginTop : "5%",
                                                marginBottom : "5%",
                                                }}/>                      
                                        </ThemeProvider>
                                        <ThemeProvider theme={theme}>
                                            <TextField onChange={ (e) => setTaskDesc(e.target.value) } //error={projDescError}
                                            id="outlined-basic" label="Description"  variant="outlined"  type="text" color="primary" 
                                            multiline 
                                            required
                                            rows={'5'}
                                            //maxRows={'5'}  
                                            sx={{ width : "100%", height: "40%"}}/>
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
            </Grid>
            <Grid item  xs={0} sm={2} md={4}>
            </Grid>
            </Grid>
        </div>
    )


}



export default CreateTeamTasks ;
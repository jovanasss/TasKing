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
import { Store } from 'react-notifications-component';



function CreateTeamTasks(){


    // konstante  za cuvanje inputa 
    const [openD, setOpenD] = useState(false)
    const [taskName , setTaskName] = useState('')
    const [taskType , setTaskType] = useState('')
    const [taskDesc ,setTaskDesc] = useState('')
    const [bodovi , setBodovi] = useState(0)
    const [projName , setProjName] = useState('')
    const [nameError , setNameError] = useState(false)
    const [typeError , setTypeError] = useState(false)
    const [descError , setDescError] = useState(false)
    const [projNameError, setProjNameError] = useState(false)
    const [projDesc , setProjDesc] = useState('')
    const [projDescError, setProjDescError] = useState(false)


    const [tasks , setTasks] = useState([])
    

    const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
    document.body.style.backgroundColor = darkMode ? "rgb(26, 25, 25)" :"azure";

    // otvaranje i zatvaranje Dijaloga 
    const handleClick = () => {
        setOpenD(true);
    }
    const handleClose = () => {
        setOpenD(false)
    }

    // error check => napraviNoviTask(Naslov , bodovi) && dodavnje u taskList parent Projekta
    const handleSubmit = () => {

      if ( taskName === ''){
        setNameError(true)
      }
      else
      {
        setNameError(false)
      }

      if ( taskType === ''){
        setTypeError(true)
      } 
      else
      {
        setTypeError(false)
      }

      if ( taskDesc === ''){
        setDescError(true)
      } 
      else
      {
        setDescError(false)
      }

      //console.log(taskName);
      //console.log(taskType);
      //console.log(taskDesc);
      if (!taskName || !taskType || !taskDesc){
        return;
      }

        if (bodovi > 0){
            setOpenD(false)
            let task = {
                naziv: taskName ,
                tip : taskType ,
                opis : taskDesc ,
                bodovi : bodovi
        };
        let arr = tasks.concat(task);
        setTasks(arr);
        //console.log(arr);
        
        }
        else {
            Store.addNotification({
                title: "Warning!",
                message: "Enter points, please",
                type: "warning",
                insert: "top",
                container: "top-center",
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
            //alert("niste uneli bodove")
        }
    

       // const t = new Task(bodovi,taskName);

       // const element = 

       //root.render(element);
       setTaskName('')
       setTaskType('')
       setTaskDesc('')
       setBodovi(0)
    }

    async function createProject(){


        // let timID = localstorage.GetItem("timID"); 



        const idTima = (JSON.parse(window.localStorage.getItem('TimID')));
        //console.log(idTima);



        const projekat = {
            naziv : projName,
            opis : projDesc,
            //taskovi : tasks
            timID : idTima,
        }
        //console.log(projekat);

        const clanTimaID = window.localStorage.getItem('clanTimaID');

        if ( tasks.length !== 0){

            let rezultat = await fetch("https://localhost:5001/Projekat/KreirajProjekat/"+clanTimaID, {
                method : 'POST',
                headers : {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Accept': 'application/json; charset=utf-8'
                },
                body : JSON.stringify(projekat)
              });
              let status = rezultat.status;
              let idProjekta = await rezultat.json();
              
              if(idProjekta === 1){
                alert("You aren't team admin");
              }
              else if (idProjekta != 0){
                              // dodati idProjekta u niz taskova i proslediti kroz body fetcha 
              // za svaki task mora da se doda novi prop idProjekta vrv preko map f-je i onda se vrti foreach sa ovim fetchom ispod
     
             /* tasks.map((task)=> {
                niz[task] = Object.assign(tasks[task] , idProjekta);
             })*/
    
             //console.log(tasks);
             // dodajemo prop idProjekta 
             tasks.forEach((element) => {
                element.projekatID = idProjekta
              });
    
              //console.log(tasks)
              
    
              //console.log(status);
    
              // ako je ok dodajemo taskove 
              if (status === 200){

                let imena = [];
                tasks.map(async task => {
                  if(imena.includes(task.naziv))
                  {
                    Store.addNotification({
                      title: "The task wasn't created!",
                      message: "This task name is already in use: " + task.naziv,
                      type: "danger",
                      insert: "top",
                      container: "top-center",
                      dismiss: {
                        duration: 2000,
                        onScreen: true
                      }
                    });
                  }
                  else{
                  imena.push(task.naziv)
                    const clanTimaID = window.localStorage.getItem('clanTimaID');
                    let result = await fetch("https://localhost:5001/Task/KreirajTask/" + clanTimaID, {
                        method : 'POST',
                        headers : {
                          'Content-Type': 'application/json; charset=utf-8',
                          'Accept': 'application/json; charset=utf-8'
                        },
                        body : JSON.stringify(task)
                      });
                    }
                })
                  localStorage.setItem('projID', idProjekta); 
                  //alert("Projekat uspesno kreiran !")
                  routeChange();

                Store.addNotification({
                  title: "Success!",
                  message: "the project is successfully created",
                  type: "success",
                  insert: "top",
                  container: "top-center",
                  dismiss: {
                    duration: 2000,
                    onScreen: true
                  }
                });
              }
              else {
    
                    // prikaz greske 
                  //console.log(status);
              }

            }
            else {
                Store.addNotification({
                    title: "Warning!",
                    message: "A project with this name already exists",
                    type: "warning",
                    insert: "top",
                    container: "top-center",
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
                //alert("Projekat  sa unetim imenom vec postoji !");
                setProjNameError(true);
            }
        }       
        else {
            Store.addNotification({
                title: "Warning!",
                message: "Add tasks, please",
                type: "warning",
                insert: "top",
                container: "top-center",
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
            //alert("Niste dodali taskove");
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
            main : "rgb(0, 100, 0)",
          }
        },
      });



    return (
        <div className="divMainTeamTasks">
            <div>           
            </div>
            <Grid container>
            <Grid item  xs={0} sm={2} md={4}>
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
            <form className={darkMode ? "formaCreateTeamTasksDM":"formaCreateTeamTasks"}>
                <div className="GlavniDivTeamTasks">
                        <div className="divNaslovCreateTeamTasks"> 
                            <img src="../../Logo/TasKingLogo.png" width="70px" height="50px" style={{float : "left"}} ></img>
                            <label className={darkMode ? "naslovCreateTeamTasksDM":"naslovCreateTeamTasks"}>CREATE A PROJECT</label>
                        </div>
                        <div className="inputProjectTitle">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setProjName(e.target.value) } error={projNameError}
                                 id="outlined-basic1" label="Project Title" variant="outlined" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} type="text" color="primary" maxRows ={'1'} required sx={{width :"85%"}}/>
                            </ThemeProvider>
                        </div>
                        <div className="inputProjectDescription">
                            <ThemeProvider theme={theme}>
                                <TextField onChange={ (e) => setProjDesc(e.target.value) } error={projDescError}
                                id="outlined-basic2" label="Description" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" 
                                multiline 
                                required
                                rows={'5'}
                                //maxRows={'5'}  
                                sx={{ width : "85%", height: "40%"}}/>
                            </ThemeProvider>
                        </div>
                        <div id="inputTasks" className={darkMode ? "inputTasksDM":"inputTasks"} rows={'5'} multiline = "true" >
                            <List style={{maxHeight: '85%', overflow: 'auto'}} >
                                 {tasks.map((task, index) => 
                            <ListItem key={index}>             
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemText primary={task.naziv} secondary={task.bodovi}/>
                            </ListItemButton>
                            </ListItem>   )}                   
                            </List>
 
                        </div>
                        <div>
                            <ThemeProvider theme={theme}>
                                <Dialog open={openD} onClose={handleClose} style={{ backgroundColor : "transparent"}}>
                                    <DialogTitle 
                                    style={{
                                         backgroundColor : darkMode? "rgb(46, 45, 45)": "white",
                                         color : darkMode? "white" : "black" ,                                      
                                         }}>
                                            Define your task and its value 
                                    </DialogTitle>
                                    <DialogContent style={{ backgroundColor : darkMode? "rgb(46, 45, 45)" : "white"}}>
                                        <ThemeProvider theme={theme}>
                                            <TextField id="outlined-basic3" label="Task Title" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                                          error={nameError}  onChange={(e) => setTaskName(e.target.value)}
                                            sx={{
                                                width :"100%",
                                                marginTop : "5%",
                                                marginBottom : "5%",
                                                }}/>                      
                                        </ThemeProvider>
                                        <ThemeProvider theme={theme}>
                                            <TextField id="outlined-basic4" label="Task Type" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                                          error={typeError}  onChange={(e) => setTaskType(e.target.value)}
                                            sx={{
                                                width :"100%",
                                                marginTop : "5%",
                                                marginBottom : "5%",
                                                }}/>                      
                                        </ThemeProvider>
                                        <ThemeProvider theme={theme}>
                                            <TextField error={descError} onChange={ (e) => setTaskDesc(e.target.value) } //error={projDescError}
                                            id="outlined-basic5" label="Description" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}   variant="outlined"  type="text" color="primary" 
                                            multiline 
                                            required
                                            rows={'5'}
                                            //maxRows={'5'}  
                                            sx={{ width : "100%", height: "40%"}}/>
                                        </ThemeProvider>

                                        <ThemeProvider theme={theme}>
                                            <Slider 
                                            value = {bodovi}
                                            onChange={(e ,value ) => setBodovi(parseInt(value))}
                                            defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                                        </ThemeProvider>
                                    </DialogContent>
                                    <DialogActions style={{ backgroundColor : darkMode? "rgb(46, 45, 45)" : "white" }}>
                                        <ThemeProvider theme={theme} ><Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button></ThemeProvider>
                                        <ThemeProvider theme={theme}><Button onClick={handleSubmit} variant="contained" color="primary" sx={{fontWeight:"bold"}}>Sumbit</Button></ThemeProvider>
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
import React, { Component, useState , Alert}  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControl, TextField,Box , MenuItem ,Select, InputLabel} from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
;

function CreateOrganisationForm (){

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
;
      let navigate = useNavigate(); 
      const routeChange = () =>{ 
        let path = `/Main`; 
        navigate(path);
        alert(JSON.stringify(type), JSON.stringify(teamName));
        console.log(type, teamName , orgName);
        
      }

      const FormTitles = ["CHOSE A NAME FOR YOUR ORGANISATION","CHOSE WHAT TYPE OF AN ORGANISATION IT IS","CREATE A TEAM"];
      const [orgName , setORGname] = useState('');
      const [orgError ,setORGerror] = useState(false);
      const [teamName ,setTEAMname] = useState('');
      const [teamError,setTEAMerror] = useState(false);
      const [type,setType] = useState('');
      const [typeError ,setTypeError] = useState(false);

      const PageDisplay = () => {

        const handleChange = (event) => {
            setType(event.target.value)
        }

          if (page === 0 ){
              return (                       
                 <ThemeProvider theme={theme}>
                    <TextField error={orgError} onChange={ (e) => setORGname(e.target.value) } id="outlined-basic" label="Name" variant="outlined" size="small" type="text" color="primary" required/>
                 </ThemeProvider>)
          }else if (page === 1){
              return (
                <ThemeProvider theme={theme}>
                  <FormControl style={{width: "50%" }}>
                        <TextField error={typeError} label = 'Select Type' select value={type} onChange = {handleChange}>           
                                <MenuItem value={1}>Faculty</MenuItem>
                                <MenuItem value={2}>School</MenuItem>
                                <MenuItem value={3}>Kita</MenuItem>
                                <MenuItem value={4}>Department</MenuItem>
                                <MenuItem value={5}>Non-Profit</MenuItem>
                                <MenuItem value={6}>Other</MenuItem>
                        </TextField> 
                  </FormControl>
                </ThemeProvider>
              )
          }else if (page === 2){
              return (
                <ThemeProvider theme={theme}>
                    <TextField error={teamError} onChange={ (e) => setTEAMname(e.target.value) } id="outlined-basic" label="Team Name" variant="outlined" size="small" type="text" color="primary" required/>
                </ThemeProvider>)
          }
      }
      const [page , setPage] = useState(0);
      const [click ,setClick] = useState(0);
      const handleCLick= () => {

        setClick(click + 1 );

        if (page === 0 && orgName && click === 0){
          setPage(page + 1)
        }
        else if(page === 0 && orgName && click >= 1){
          setPage(page + 1)
        }
        else {
          setORGerror(true);
        }

        if (page === 1 && type){
          setTypeError(false);
          setPage(page + 1);
        }
        else if(page === 1 && type === '' && orgName){
          setTypeError(true);
        }


        if (page === 2 && teamName){
          setTEAMerror(false);
          routeChange();
        }
        else if(page === 2 && teamName === ''){
          setTEAMerror(true);
        }
      }

    return (
        <div className="divMainCORG">
            <form className="formaCORG">
                <div className="GlavniDivCORG">

                    <div className="divNaslovCORG"> 
                        <label className="naslovCORG">{FormTitles[page]}</label>
                    </div>

                    <div className="divSteps">
                        <label className="labelSteps">Step {page + 1} out of 3 </label>
                    </div>

                    <div className="inputORGname">
                         {PageDisplay()}
                    </div>

                    <div className="divCORGbuttons">
                        <button  className="BtnCORG" onClick={(event) => { event.preventDefault() ; handleCLick(); } }>{page < 2 ? "NEXT" : "FINISH" } </button>
                    </div>


                </div>
            </form>
        </div>
    )
}



export default CreateOrganisationForm ;
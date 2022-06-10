import React, { Component, useState , Alert}  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControl, TextField,Box , MenuItem ,Select, InputLabel} from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';


function CreateOrganisationForm (){




      const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
      document.body.style.backgroundColor = darkMode ? "rgb(26, 25, 25)" :"azure";

      // kreiranje MUI teme
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

      // promena stranice
      let navigate = useNavigate(); 


      // kreiranje organizacije i tima 
      async function createOrganisation() { 
        let path = `/Main`; 

        // alert(JSON.stringify(type), JSON.stringify(teamName));
        console.log(type, teamName , orgName);
        const organizacija = {
          //type : type,
          ime : orgName
        }

        let proveraTima = await fetch("https://localhost:5001/Tim/VratiTimIME/"+teamName , {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        });
        proveraTima = await proveraTima.json();
        console.log("Vrati tim :" ,proveraTima);
        if (proveraTima === 0){
          let result = await fetch("https://localhost:5001/Organizacija/KreirajOrganizaciju/", {
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(organizacija)
          });
          let status = result.status ;
          result  = await result.json();
          if (result != 0)     
          {
  
            let idNoveOrg = result ;
            const admin = true ;
            const user = (JSON.parse(window.localStorage.getItem('user-info')));
            console.log(user.id);
            console.log("ID Nove Organizacije :" ,idNoveOrg);
            console.log(status)
            const ClanOrganizacije = {
              idKorisnika : user.id,
              idOrganizacije : idNoveOrg,
              admin : admin
            }        
            let temp = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/",{
              method : 'POST',
              headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
              },
              body : JSON.stringify(ClanOrganizacije)
            });
            let statusU = temp.status ;
            temp = await temp.json();
            let idClanaORG = temp ;
            console.log("IDclanaOrganizacije :" ,idClanaORG);
            console.log(statusU);
  
  
            const tim = {
              ime : teamName ,
              idOrganizacije : idNoveOrg,
              
            }
            console.log(tim);
  
  
            let rezultat = await fetch("https://localhost:5001/Tim/KreirajTim/", {
              method : 'POST',
              headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
              },
              body : JSON.stringify(tim)
            });
            let statusT = rezultat.status;
            rezultat = await rezultat.json();
  
  
              let idNovogTima = rezultat ;
              console.log("ID novog tima :" ,idNovogTima);
              const vodja = true ;
              //result  = await result.json();
              console.log(statusT);
  
              const ClanTima = {
                idClanaOrganizacije : idClanaORG,
                idtima : idNovogTima,
                vodja : vodja
              }
              console.log(ClanTima);
  
              let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/",{
                method : 'POST',
                headers : {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Accept': 'application/json; charset=utf-8'
                },
                body : JSON.stringify(ClanTima)
              });
              
              console.log(tmp.status);
              if(tmp.status === 200){
                navigate(path)
              }
  
          }
          else{
              alert("Organizacija sa unetim imenom vec postoji !")
              setPage(0);
          }
          
        }
        else {
          alert("Tim sa unetim imenom vec postoji")
          setTEAMerror(true);
        }


      
      }
      
      // konstante za cuvanje inputa + listaNaslova
      const FormTitles = ["CHOSE A NAME FOR YOUR ORGANISATION","CHOSE WHAT TYPE OF AN ORGANISATION IT IS","CREATE A TEAM"];
      const [orgName , setORGname] = useState('');
      const [orgError ,setORGerror] = useState(false);
      const [teamName ,setTEAMname] = useState('');
      const [teamError,setTEAMerror] = useState(false);
      const [type,setType] = useState('');
      const [typeError ,setTypeError] = useState(false);


      // LOGIKA za promenu strane forme 


      const PageDisplay = () => {

        // ubacivanje tipa iz selecta u nas type state 
        const handleChange = (event) => {
            setType(event.target.value)
        }
          // renderovanje u zavisnosti koja je strana 
          if (page === 0 ){
              return (                       
                 <ThemeProvider theme={theme}>
                    <TextField error={orgError} onChange={ (e) => setORGname(e.target.value) } id="outlined-basic" label="Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined" size="small" type="text" color="primary" required/>
                 </ThemeProvider>)
          }else if (page === 1){
              return (
                <ThemeProvider theme={theme}>
                  <FormControl style={{width: "50%" }}>
                        <TextField error={typeError} label = 'Select Type' inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  select value={type} onChange = {handleChange}>           
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
                    <TextField error={teamError} onChange={ (e) => setTEAMname(e.target.value) } id="outlined-basic" label="Team Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined" size="small" type="text" color="primary" required/>
                </ThemeProvider>)
          }
      }

      // pamcenje indexa strane  + brojanje klikova
      const [page , setPage] = useState(0);
      const [click ,setClick] = useState(0);


      // handlovanje promene strane => poziva kreiranje organizacije na kraju 
      const handleCLick= () => {

        // klikom na dugme se inkrementira
        setClick(click + 1 );


        // ako smo na prvoj strani i popunili smo polje a pre toga nismo kliknuli
        // idemo dalje 
        if (page === 0 && orgName && click === 0){
          setPage(page + 1)
        }

        // ako je ovo gore tacno plus vec smo jednom kliknuli resetuje se error i promenimo stranu
        else if(page === 0 && orgName && click >= 1){
          setPage(page + 1)
        }
        else {
          setORGerror(true);
        }

        // ako smo na drugoj strani i imamo tip resetujemo error i menjamo stranu page = 2
        if (page === 1 && type){
          setTypeError(false);
          setPage(page + 1);
        }
        // provera da li postoji input na prethodnoj a na ovoj nema klikom na dugme dobijamo error
        else if(page === 1 && type === '' && orgName){
          setTypeError(true);
        }

        // ako smo na trecoj strani  i popunili smo input error => false  i kreiramo oraganizaciju
        if (page === 2 && teamName){
          setTEAMerror(false);
          createOrganisation();
        }
        // ali ako nismo pupunili input vracamo error 
        else if(page === 2 && teamName === ''){
          setTEAMerror(true);
        }
      }


      // =================================


    return (
        <div className="divMainCORG">
            <Grid container>
            <Grid item  xs={0} sm={2} md={4.5}>
            </Grid>
            <Grid item xs={12} sm={8} md={3}>
            <form className={darkMode ? "formaCORGDM" :"formaCORG"}>
                <div className="GlavniDivCORG">

                    <div className="divNaslovCORG"> 
                        <label className="naslovCORG">{FormTitles[page]}</label>
                    </div>

                    <div className="divSteps">
                        <label className={darkMode ? "labelStepsDM" :"labelSteps"}>Step {page + 1} out of 3 </label>
                    </div>

                    <div className="inputORGname">
                         {PageDisplay()}
                    </div>

                    <div className="divCORGbuttons">
                        <button  className="BtnCORG" onClick={(event) => { event.preventDefault() ; handleCLick(); } }>{page < 2 ? "NEXT" : "FINISH" } </button>
                    </div>


                </div>
            </form>
            </Grid>
            <Grid item  xs={0} sm={2} md={4.5}>
            </Grid>
            </Grid>
        </div>
    )
}



export default CreateOrganisationForm ;
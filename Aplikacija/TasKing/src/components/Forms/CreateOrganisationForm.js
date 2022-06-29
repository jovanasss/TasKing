import React, { Component, useState , Alert}  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControl, TextField,Box , MenuItem ,Select, InputLabel} from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { Store } from 'react-notifications-component';


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

      const generate = () => {

        let num ='1ABCD2EFG3HIJK4LMN5OPQ6RS7TUV8WXYZ9';
        let OTP ='';
    
          for ( let i =0 ; i<6;i++){
            OTP +=num[Math.floor(Math.random()*10)];
          }
    
          return OTP
      }
    
      async function generateCodeTeam()  {
    
        let codeValid = false ; 

        while(!codeValid){

          let OTP = generate();
          let result = await fetch("https://localhost:5001/Tim/TeamCodeCheck/" + OTP + "/" + localStorage.getItem('user-info') ,
          {
              method:"GET",
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          result = await result.json();
          //console.log(result);
          if ( result === false){
            //console.log(result , OTP);
            codeValid = true ;
            return OTP;
          }
          else break;
        }
    }

      async function generateCodeORG()  {

      let codeValid = false ;

      while(!codeValid){
        
        let OTP = generate();
        let result = await fetch("https://localhost:5001/Organizacija/ORGCodeCheck/" + OTP + "/" + localStorage.getItem('user-info'),
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        result = await result.json();
        if ( result === false){
          codeValid = true ;
          return OTP;
        }
        else break ;
      }

    }

      // kreiranje organizacije i tima 
      async function createOrganisation() 
      { 

        const token = (JSON.parse(window.localStorage.getItem('user-info')));

        let valid = await fetch("https://localhost:5001/Korisnik/ProveriToken/", {
          method : 'POST',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
          body : JSON.stringify(token.value)
        });
        let b = await valid.json()
        if ( b === 1)
        {



        let path = `/Main`; 

        // alert(JSON.stringify(type), JSON.stringify(teamName));
        //console.log(type, teamName , orgName);
        const organizacija = {
          //type : type,
          ime : orgName,
          kod : await generateCodeORG()
        }

        let proveraTima = await fetch("https://localhost:5001/Tim/VratiTimIME/"+teamName+"/"+0 + "/" + localStorage.getItem('user-info'), {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
          },
        });
        proveraTima = await proveraTima.json();
        //console.log("Vrati tim :" ,proveraTima);

        if (proveraTima === 0)
        {
                let result = await fetch("https://localhost:5001/Organizacija/KreirajOrganizaciju/"+ localStorage.getItem('user-info'), {
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

                      let userID = await fetch("https://localhost:5001/Korisnik/VratiIDKorisnika/"+token.value , {
                        method : 'GET',
                        headers : {
                          'Content-Type': 'application/json; charset=utf-8',
                          'Accept': 'application/json; charset=utf-8'
                        },
                      })
                      userID = await userID.json();
                      //console.log(userID[0].id);
                      //console.log(user.id);
                      //("ID Nove Organizacije :" ,idNoveOrg);
                      //console.log(status)
                      const ClanOrganizacije = {
                        idKorisnika : userID[0].id,
                        idOrganizacije : idNoveOrg,
                        admin : admin
                      }        
                      let temp = await fetch("https://localhost:5001/Organizacija/UclaniUOrganizaciju/" + localStorage.getItem('user-info'),
                      {
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
                      //console.log("IDclanaOrganizacije :" ,idClanaORG);
                      //console.log(statusU);
                      
            
                      const tim = {
                        ime : teamName ,
                        idOrganizacije : idNoveOrg,
                        kod : await generateCodeTeam(),
                      }
                      //console.log(tim);
            
            
                      let rezultat = await fetch("https://localhost:5001/Tim/KreirajTim/" + localStorage.getItem("user-info"), {
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
                        //console.log("ID novog tima :" ,idNovogTima);
                        const vodja = true ;
                        //result  = await result.json();
                        //console.log(statusT);
            
                        const ClanTima = {
                          idClanaOrganizacije : idClanaORG,
                          idtima : idNovogTima,
                          vodja : vodja
                        }
                        //console.log(ClanTima);
            
                        let tmp = await fetch("https://localhost:5001/Tim/UclaniUTim/"+ localStorage.getItem('user-info'),{
                          method : 'POST',
                          headers : {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json; charset=utf-8'
                          },
                          body : JSON.stringify(ClanTima)
                        });
                        
                        //console.log(tmp.status);
                        if(tmp.status === 200){
                          Store.addNotification({
                            title: "Success",
                            message: "The organization is successfully created 😀",
                            type: "success",
                            insert: "top",
                            container: "top-center",
                            dismiss: {
                              duration: 2000,
                              onScreen: true
                            }
                          });
                          //alert("Uspesno kreirana organizacija !")

                          
                localStorage.setItem('OrgID',idNoveOrg); 

                fetch("https://localhost:5001/Organizacija/UlogujClanaOrganizacije/" + temp + "/" + localStorage.getItem('user-info'),
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res =>{
                  if(res.ok){
                    res.json().then(data => {
                      //console.log(data.value);
                      localStorage.setItem('clanOrgID',data.value);
                    })
                  }
                })
 
                 localStorage.setItem('TimID',idNovogTima); 
 
                 tmp = await tmp.json();
                fetch("https://localhost:5001/Tim/UlogujClanaTima/" + tmp + "/" + localStorage.getItem('user-info'), 
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res =>{
                  if(res.ok){
                    res.json().then(data => {
                      //console.log(data.value);
                      localStorage.setItem('clanTimaID',data.value);
                    })
                  }
                })
                
                          navigate(path)
                        }
            
                }
                else{
                  Store.addNotification({
                    title: "Warning!",
                    message: "An organization with this name already exists",
                    type: "warning",
                    insert: "top",
                    container: "top-center",
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
                    //alert("Organizacija sa unetim imenom vec postoji !")
                    setPage(0);
                }
                    
        }
        else {
          Store.addNotification({
            title: "Warning!",
            message: "A team with this name already exists",
            type: "warning",
            insert: "top",
            container: "top-center",
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
          //alert("Tim sa unetim imenom vec postoji")
          setTEAMerror(true);
        }    
      }else{
        Store.addNotification({
          title: "Error!",
          message: "invalid code",
          type: "danger",
          insert: "top",
          container: "top-center",
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        //alert("NEVALIDAN KOD !!!"); 
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
                    <TextField error={orgError} onChange={ (e) => setORGname(e.target.value) } id="outlined-basic1" label="Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined" size="small" type="text" color="primary" required/>
                 </ThemeProvider>)
          }else if (page === 1){
              return (
                <ThemeProvider theme={theme}>
                  <FormControl style={{width: "50%" }}>
                        <TextField error={typeError} label = 'Select Type' inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  select value={type} onChange = {handleChange}>           
                                <MenuItem value={1}>Faculty</MenuItem>
                                <MenuItem value={2}>School</MenuItem>
                                <MenuItem value={3}>Clinic</MenuItem>
                                <MenuItem value={4}>Department</MenuItem>
                                <MenuItem value={5}>Non-Profit</MenuItem>
                                <MenuItem value={6}>E-commerce</MenuItem>
                                <MenuItem value={7}>Other</MenuItem>
                        </TextField> 
                  </FormControl>
                </ThemeProvider>
              )
          }else if (page === 2){
              return (
                <ThemeProvider theme={theme}>
                    <TextField error={teamError} onChange={ (e) => setTEAMname(e.target.value) } id="outlined-basic2" label="Team Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}}  variant="outlined" size="small" type="text" color="primary" required/>
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
                        <img src="../../Logo/TasKingLogo.png" width="60px" height="40px" style={{float : "left"}} ></img>
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
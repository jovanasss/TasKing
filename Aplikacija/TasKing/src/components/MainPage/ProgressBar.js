import * as React from 'react';
//import '../styles/MainPage/ProgressBar.css';
import { AppBar, Toolbar, Typography, createTheme} from '@mui/material';

export default function ProgressBar(props) {

    const displej = ['inline','none']

  const theme = createTheme({
    components: {
        MuiIconButton: {styleOverrides:{
         root: {
          "&:hover": {
            backgroundColor: "rgb(255, 255, 255)",
          },
          backgroundColor: "rgb(255, 255, 255)",
          float: 'right'
         }
        }}
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
  
  return (
    <div>
        <AppBar position="static" className='upMenu' style={{ background: "rgb(17, 156, 151)" }}>
          <Toolbar className='upToolbar'>
            <div className='progressDiv' style={{ display:'flex', marginTop:'10px', marginBottom:'10px'}}>
                <Typography variant="h6" color="inherit" style={{ marginLeft:'10px'}}>
                Tasks done
                </Typography>
                <Typography  variant="h6" color="inherit" style={{ marginLeft:'5vw', display: props.vodjaStatus? 'none' : 'inline'}}>
                Your effect: 
                </Typography>
                <div
                  style={{
                      width: props.procenat*0.3+"vw", 
                      border: "1px solid black", 
                      borderRadius:"10px",
                      height:"16px",
                      alignSelf:'center',
                      display: props.vodjaStatus? 'none' : 'inline',
                      backgroundColor: 
                      props.procenat >= 0 && props.procenat <= 25 
                      ? 
                      "red" 
                      : 
                      props.procenat> 25 && props.procenat <= 50
                      ?
                      "orange"
                      :
                      props.procenat > 50 && props.procenat <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div>     
                 <Typography variant="h6" color="inherit" component="div" style={{ marginLeft:'20px', display: props.vodjaStatus? 'none' : 'inline', alignSelf:'center' }}>
                      {parseInt(props.procenat)}%
                </Typography>
            </div>
              
            <div className='UpMenuBtnDiv'>
            </div>
          </Toolbar>
        </AppBar>
    </div>
  );
}
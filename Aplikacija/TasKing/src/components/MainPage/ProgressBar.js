import * as React from 'react';
//import '../styles/MainPage/ProgressBar.css';
import { AppBar, Toolbar, Typography, createTheme} from '@mui/material';

export default function ProgressBar(props) {

    const [effect, setEffect] = React.useState(86);
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
            <div className='progressDiv'>
                <Typography className='effectText' variant="h6" color="inherit" component="div" style={{ marginLeft:'10px'}}>
                Tasks done
                </Typography>
                <Typography className='effectText' variant="h6" color="inherit" component="div"style={{ marginLeft:'50px', display: displej[props.vodjaStatus? 1 : 0]}}>
                Your effect:
                </Typography>
                <div
                  style={{
                      display: displej[props.vodjaStatus? 1 : 0],
                      width: effect*5, 
                      border: "1px solid black", 
                      borderRadius:"10px",
                      height:"15px",
                      marginLeft:'10px',
                      backgroundColor: 
                      parseInt(effect) > 0 && parseInt(effect) <= 25 
                      ? 
                      "red" 
                      : 
                      parseInt(effect) > 25 && parseInt(effect) <= 50
                      ?
                      "orange"
                      :
                      parseInt(effect) > 50 && parseInt(effect) <= 75
                      ?
                      "yellow"
                      :
                      "green"
                      }}>
                 </div>    
                 <Typography variant="h6" color="inherit" component="div" style={{ marginLeft:'20px', display: displej[props.vodjaStatus? 1 : 0] }}>
                      {parseInt(effect)}%
                </Typography>
            </div>
              
            <div className='UpMenuBtnDiv'>
            </div>
          </Toolbar>
        </AppBar>
    </div>
  );
}
import * as React from 'react';
import '../styles/UpProjectMenu.css';
import { AppBar, IconButton, Toolbar, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



export default function UpProjectMenu() {
  let navigate = useNavigate();


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
        <AppBar position="static" className='upMenu' style={{ background: "rgb(0, 86, 83)" }}>
          <Toolbar className='upToolbar'>
            <Typography variant="h6" color="inherit" component="div">
              Taskovi
            </Typography>
              <div className='UpMenuBtnDiv'>
            <ThemeProvider theme={theme}>
              <IconButton className='upMenuBtn' onClick={() => navigate("/Profile")}>
                <SubjectOutlined/>
              </IconButton>
            </ThemeProvider>
            </div>
          </Toolbar>
        </AppBar>
    </div>
  );
}
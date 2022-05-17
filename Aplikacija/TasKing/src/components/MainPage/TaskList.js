//import '../styles/MainPage/TaskList.css';
import React, { Component, useState } from 'react';
import { Button, Card, CardActions, CardContent, createTheme} from '@mui/material';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const drawerWidth = 240

/*
const useStyles = makeStyles({
    drawer: {
      width: drawerWidth,
      ".MuiDrawer-paper": {
        width: drawerWidth,
      },
    },
  })*/

  const tasks = [
    {
        id:0,
        naziv:"Dodaj MyAccount dugme",
        opis:"Dodaj dugme za pregled sopstvenog accounta. Bilo bi najbolje kada bi dugme bilo u uglu",
        poeni: 5,
        status: 0
    },
    {
        id:1,
        naziv:"Popravi responsivness login ekrana",
        opis:"Napravi da login screen izgleda dobro u svakoj rezoluciji",
        poeni: 10,
        status: 0
    },
    {
        id:2,
        naziv:"Osmisli dizajn pocetne stranice",
        opis:"Pocetna stranca treba da sazdrzi sve opcije koje korisnik treba da ima da bi se lagodno kretao i koristio aplikaciju",
        poeni: 5,
        status: 1
    },
    {
        id:3,
        naziv:"Osmisli i napravi logo",
        opis:"Nice project",
        poeni: 7,
        status: 0
    },
    {
        id:4,
        naziv:"Popuni 5 dokumentaciju",
        opis:"Popuni i izmeni vec kreiranu dokumentaciju. Jako je bitno da se na sva pitanja odgovorri na propisan nacin i da dokumentacija bude legitimna",
        poeni: 5,
        status: 2
    },
    {
        id:5,
        naziv:"Osmisli dobar marketing, marketing",
        opis:"koristis",
        poeni: 3,
        status: 0
    },
    {
        id:6,
        naziv:"Popravi funkcionalnost login bara",
        opis:"Popravi",
        poeni: 5,
        status: 3
    }
]
  



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

  /*return(
    <div className='taskList'>
    {organisationItems.map(item => (
      <ThemeProvider theme={theme}>
               <Button  key={item.id}  onClick={() =>{setOrg(item.id)}} className={curOrg==item.id? 'active' : null}>
                   <Typography className='taskTekst' variant="h7"> {item.name}</Typography>
               </Button>
      </ThemeProvider>
           ))}
    </div>
  )*/

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

  const tekstovi = ["I'm intreseted", "Cancel", "Done", ""]
  const displej = ['inline', 'inline', 'inline', 'none']
  const imeKlasa = ['normal', 'intrested', 'working', 'waitingReview']
  const boje = ['rgb(255, 255, 255)', 'rgb(255, 207, 49)', 'rgb(77, 154, 255)', 'rgb(78, 255, 93)']

//className={imeKlasa[task.status]}
// backgroundColor:boje[task.status]
  return(
        <div className="divTasks">
                {tasks.filter(task => task.status==props.selected-1 || props.selected==0).map((task, index) => (
                <Box sx={{ minWidth: 280, maxWidth: 340 ,margin:"0.5%" }}>
                  <Card variant="outlined" 
                  sx={{boxShadow: "0 8px 16px 0 rgba(0,0,0,0), 0 6px 20px 0 rgba(0,0,0,0.19)", backgroundColor:boje[task.status] }}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {task.naziv.slice(0,100) + (task.naziv.length>100? "..." : "")}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          {"Descripiton: " + task.opis.slice(0,100) + (task.opis.length>100? "..." : "")}
                        </Typography>
                        <Typography sx={{ mb: 1.5, fontSize:15 , fontWeight: 'bold' }} color="text.primary">
                          poeni: {task.poeni} 
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
                            sx={{ border:"2px solid black", borderRadius:"10px", display: displej[task.status]}}
                            color="primary">
                              {tekstovi[task.status]}
                          </Button>
                        </ThemeProvider> 
                      </CardActions>
                  </Card>
                </Box> ))}
                <Dialog
                          open={open}
                          onClose={handleClose}
                          scroll={scroll}
                          aria-labelledby={"scroll-dialog-title"}
                          aria-describedby="scroll-dialog-description"
                          >
                            <DialogTitle id="scroll-dialog-title">{tasks[dialogTask].naziv}</DialogTitle>
                              <DialogContent dividers={scroll === 'paper'}>
                                <DialogContentText
                                  id="scroll-dialog-description"
                                  ref={descriptionElementRef}
                                  tabIndex={-1}>
                                  {tasks[dialogTask].opis}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                              <Button onClick={handleClose}>ok</Button>
                            </DialogActions>
                </Dialog>
      </div>
)
}

export default TaskList;
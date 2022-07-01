import { useEffect, useState } from "react";
import {Navigate , Outlet} from "react-router-dom";


const ProtectedRoutes = () => {
    const [login, setLogIn] = useState(null);
    useEffect(()=>{
        const token = (JSON.parse(window.localStorage.getItem('user-info')));
        if(token===null)
        {
            setLogIn(false);
            return;
        }
    
        fetch("https://localhost:5001/Korisnik/ProveriToken/", {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(token.value),
            }).then(res => {
                res.json()
                .then(data => {
                    //console.log(data);
                    if ( data === 0){
                        setLogIn(false);
                        //console.log(loggedIn);
                    }else{
                        setLogIn(true);
                        //console.log(loggedIn);
                    }
                });
            }
            )
    },[])
//isAuth ? <Outlet/> : <Navigate to = "/" /> ;
if(login==null)
    return;

    return  (login==true? <Outlet/>: <Navigate to = "/" />) ;
};


export default ProtectedRoutes ;
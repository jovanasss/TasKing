import { useEffect, useState } from "react";
import {Navigate , Outlet} from "react-router-dom";

const AdminRoutes = () => {
    const [vodja, setVodja] = useState(null);
    useEffect(()=>{
        const token = localStorage.getItem('clanTimaID');

        if(token===null)
        {
            setVodja(false);
            return;
        }

        fetch("https://localhost:5001/Korisnik/ProveriVodju/" + token, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
            },
            }).then(res => {
                res.json()
                .then(data => {
                    if ( data === false){
                        setVodja(false);
                        alert("Not authorized");
                    }else{
                        setVodja(true);
                    }
                });
            }
            )

    },[])
//isAuth ? <Outlet/> : <Navigate to = "/" /> ;
if(vodja==null)
    return;

    return  (vodja==true? <Outlet/>: <Navigate to = "/" />) ;
};

export default AdminRoutes ;
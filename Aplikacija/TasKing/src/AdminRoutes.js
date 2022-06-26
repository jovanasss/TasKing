import {Navigate , Outlet} from "react-router-dom";


async function proveri() {

    let vodjaCheck = false ;
    const token = localStorage.getItem('clanTimaID');

    let temp =  await fetch("https://localhost:5001/Korisnik/ProveriVodju/" + token, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
        },
        })
        temp = await temp.json();
        if ( temp === false){
            vodjaCheck = false;
            console.log(vodjaCheck);
        }else{
            vodjaCheck = true;
            console.log(vodjaCheck);
        }

        await sleep(1000);
        console.log(vodjaCheck);
        return vodjaCheck;

    /*fetch("https://localhost:5001/Korisnik/ProveriVodju/" + token, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
        },
        }).then(res => {
            res.json()
            .then(data => {
                console.log(data);
                if ( data == false){
                    vodjaCheck = false;
                    console.log(vodjaCheck);
                }else{
                    vodjaCheck = true;
                    console.log(vodjaCheck);
                }           
            });
        }
        )*/

}
function sleep(ms) {

    // add ms millisecond timeout before promise resolution
    return new Promise(resolve => setTimeout(resolve, ms))
  }

async function useAuth()  {

    var vodja = false; 
    const token = localStorage.getItem('clanTimaID');

    //console.log(token.value);
    if (token === null){
        console.log(vodja);
        return vodja;
    }
    else{
        vodja = proveri().then( a => console.log(a));
        await sleep(1000);
        return vodja;     
    }
}
const AdminRoutes= () => {

    const isAuth =  useAuth();
    return isAuth ? <Outlet/> : <Navigate to = "/" /> ;
    
};

export default AdminRoutes ;
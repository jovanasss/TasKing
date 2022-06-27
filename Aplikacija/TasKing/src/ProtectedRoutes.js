import {Navigate , Outlet} from "react-router-dom";


async function proveri() {

    let loggedIn = false ;
    const token = (JSON.parse(window.localStorage.getItem('user-info')));

    fetch("https://localhost:5001/Korisnik/ProveriToken/" + token.value, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
        },
        }).then(res => {
            res.json()
            .then(data => {
                console.log(data);
                if ( data === 0){
                    loggedIn = false;
                    console.log(loggedIn);
                }else{
                    loggedIn = true;
                    console.log(loggedIn);
                }
            });
        }
        )
    await sleep(1000);
    return loggedIn;

}
function sleep(ms) {

    // add ms millisecond timeout before promise resolution
    return new Promise(resolve => setTimeout(resolve, ms))
  }

const useAuth = () => {

    var loggedIn = false;

    const token = (JSON.parse(window.localStorage.getItem('user-info')));


    //console.log(token.value);
    if (token === null){
        console.log(loggedIn);
        return loggedIn;
    }
    else{

        loggedIn = proveri();
        return loggedIn ;
    }
}
const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to = "/" /> ;
};

export default ProtectedRoutes ;
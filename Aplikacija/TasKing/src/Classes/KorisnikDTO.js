import React , {Component } from 'react'



class Korisnik extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            korisnickoIme : props.korisnickoIme ,
            lozinka : props.lozinka,
            ime : props.ime,
            prezime : props.prezime,
            email : props.email,
            brojTelefona : props.brojTelefona};
    }
    render(){
        return <div></div>
    }


}

export default Korisnik ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Models;

namespace TasKing.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KorisnikController : ControllerBase
    {
        public TasKingContext Context { get; set; }
        private readonly JwtService jwtService ;

        public KorisnikController(TasKingContext context , JwtService JwtService)
        {
            Context = context;
            jwtService = JwtService;
        }
        
        [Route("UnesiKorisnika")]
        [HttpPost]
        public async Task<ActionResult> OtvoriNalog([FromBody] NoviKorisnikDTO korisnik)
        {
            var k = Context.Korisnici.Where(k => k.email == korisnik.email).FirstOrDefault();
            if(k == null)
            {
                var kor = Context.Korisnici.Where(k => k.korisnickoIme == korisnik.korisnickoIme).FirstOrDefault();

                if(kor == null)
                {
                    if(string.IsNullOrWhiteSpace(korisnik.ime) || korisnik.ime.Length > 20 || korisnik.ime.Any(Char.IsDigit))
                        {
                           return BadRequest("Ime je prazno ili sadrzi cifru ili je duze od 20!");
                        }

                    if(string.IsNullOrWhiteSpace(korisnik.prezime) || korisnik.prezime.Length > 30 || korisnik.prezime.Any(Char.IsDigit))
                        {
                           return BadRequest("Prezime je prazno ili sadrzi cifru ili je duze od 30!");
                        }

                    string pattern = @"^[a-zA-Z0-9+_.-]+@[a-z]+[.]+[c]+[o]+[m]$";
                    bool IsEmail = Regex.IsMatch(korisnik.email, pattern);
                    if(string.IsNullOrWhiteSpace(korisnik.email) || IsEmail == false)
                        {
                           return BadRequest("Email je prazan ili ima neodgovarajuci format!");
                        }

                        if(string.IsNullOrWhiteSpace(korisnik.korisnickoIme) || korisnik.korisnickoIme.Length > 20)
                        {
                           return BadRequest("Korisnicko ime je prazno ili je duze od 20!");
                        }

                        if(string.IsNullOrWhiteSpace(korisnik.lozinka) || korisnik.lozinka.Length > 20)
                        {
                           return BadRequest("Lozinka je prazna ili je duza od 20!");
                        }

                        if( korisnik.brTelefona.Length > 20 || korisnik.brTelefona.Any(Char.IsControl))
                        {
                           return BadRequest("Broj telefona je prazan ili je duzi od 20!");
                        }

                        try
                        {
                            Korisnik korisnik1 = new Korisnik
                            {
                                ime = korisnik.ime,
                                prezime = korisnik.prezime,
                                korisnickoIme = korisnik.korisnickoIme,
                                lozinka = korisnik.lozinka,
                                email = korisnik.email,
                                //profilnaSlika = korisnik.profilnaSlika,
                                brTelefona = korisnik.brTelefona
                            };

                            Context.Korisnici.Add(korisnik1);
                            await Context.SaveChangesAsync();

                            var podaci = new
                            {
                                korisnickoIme = korisnik1.korisnickoIme,
                                lozinka = korisnik1.lozinka,
                                id = korisnik1.ID
                            };
                            return Ok("1");

                        }

                        catch(Exception e)
                        {
                             return BadRequest("Doslo je do greske:" + e.Message);
                        }
                }
                else
                {
                    return BadRequest("Korisnicko ime je zauzeto!");
                }
            }
            else
            {
                return Ok("2");
            }
        }

        [Route("UlogujKorisnika")]
        [HttpPost]
        public async Task<ActionResult> UlogujKorisnika([FromBody] KorisnikDTO user)
        {
            try{

                // verifikacija korisnika 

                Korisnik k1 = await Context.Korisnici.Where(k => k.korisnickoIme == user.korisnickoIme).FirstOrDefaultAsync();
                if(k1 == null || k1.lozinka != user.lozinka){
                    return Ok(0); // nepostojeci korisnik
                }

                // Korisnik postoji => generisi token , vrati token 

                else
                {
                    var jwt = new
                     {
                        value = jwtService.Generate(k1.ID)
                     };

                    return Ok(jwt);
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ProveriToken")]
        [HttpPost]
        public async Task<ActionResult> ProveriToken([FromBody] string token)
        {       
                //Console.Write(token);

                // verify vraca null ako je nevalidan ili ako je null 
                var validanToken = jwtService.Verify(token);

                
                if (validanToken == null){
                    return Ok(0);
                }
                else 
                return Ok(1);
        }


        [Route("VratiClanoveOrganizacije/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveOrganizacije(string jwt)
        {    
                 try
                {
                    // verifikujemo token

                    var token = jwtService.Verify(jwt);

                    if ( token == null)
                    {
                        return BadRequest(-2);
                    }
                    int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    // verifikujemo korisnika 

                    Korisnik korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                    if(korisnik==null)
                    {
                         return BadRequest("nepostojeci korisnik");
                    }

                    var clanInfo = await Context.ClanoviOrganizacije

                            .Include(p=>p.organizacija)
                            .Where(p=>p.korisnik==korisnik && p.izbacen==false)
                            .Select(p=>

                            new{
                                idClan = p.ID,
                                imeOrganizacije = p.organizacija.ime,
                                administrator = p.administrator,
                                vremePosecivanja = p.vremePosecivanja,
                                orgID = p.organizacija.ID,
                                slika = p.organizacija.slika,
                                kod = p.organizacija.kod
                            }).ToArrayAsync();               
                            return Ok(clanInfo);

                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("VratiKorisnika/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiKorisnika(string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikovanje korisnika 

                var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
                if ( korisnik == null )
                {
                    return BadRequest("Nepostojeci korisnik ");
                }

                var korisnici = await Context.Korisnici
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    ime = k.ime,
                    prezime = k.prezime,
                    korisnickoIme = k.korisnickoIme,
                    email = k.email,
                    brtelefona = k.brTelefona,
                    profilnaSlika = k.profilnaSlika,
                    lozinka = k.lozinka
                }).ToListAsync();

                return Ok(korisnici);
            }

            catch(Exception e)
            {
                return Unauthorized();
            }
        }


        // nzm kako da implementiram token ovde

        [Route("VratiGledanogKorisnika/{userID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiGledanogKorisnika(int userID, string jwt)
        {
            try
            {
                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int ID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                var korisnik = await Context.Korisnici.Where( k => k.ID == ID).FirstOrDefaultAsync();
                if(korisnik==null)
                {
                    return BadRequest(-4);
                }

                var korisnici = await Context.Korisnici
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    ime = k.ime,
                    prezime = k.prezime,
                    korisnickoIme = k.korisnickoIme,
                    email = k.email,
                    brtelefona = k.brTelefona,
                    profilnaSlika = k.profilnaSlika
                }).ToListAsync();
    
                if(korisnici==null)
                {
                    return BadRequest(-3);
                }

                return Ok(korisnici);
            }

            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("VratiIDKorisnika/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDKorisnika(string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikovanje korisnika 

                var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
                if ( korisnik == null )
                {
                    return BadRequest("Nepostojeci korisnik ");
                }

                var korisnici = await Context.Korisnici
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    id = k.ID,      
 
                }).ToListAsync();

                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("PromeniUsernameKorisniku/{jwt}/{newusername}")]
        [HttpPut]
        public async Task<ActionResult> PromeniUsernameKorisniku(string jwt, string newusername)

        {

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje korisnika 

            var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
            if ( korisnik == null )
            {
                return BadRequest("Nepostojeci korisnik ");
            }
            if (korisnik.korisnickoIme == newusername)
            {
                return BadRequest("Isti username");
            }

            try
            {
                korisnik.korisnickoIme = newusername;
                await Context.SaveChangesAsync();
                return Ok("Username je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PromeniBrTelefonaKorisniku/{jwt}/{novibrtelefona}")]
        [HttpPut]
        public async Task<ActionResult> PromeniBrTelefonaKorisniku(string jwt, string novibrtelefona)
        {
            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje korisnika 

            var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
            if ( korisnik == null )
            {
                return BadRequest("Nepostojeci korisnik ");
            }
            if (korisnik.brTelefona == novibrtelefona)
            {
                return BadRequest("Isti broj telefona");
            }

            try
            {
                korisnik.brTelefona = novibrtelefona;
                await Context.SaveChangesAsync();
                return Ok("Broj telefona je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PromeniSlikuKorisniku/{jwt}/{novaslika}")]
        [HttpPut]
        public async Task<ActionResult> PromeniSlikuKorisniku(string jwt, string novaslika)
        {

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje korisnika 

            var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
            if ( korisnik == null )
            {
                return BadRequest("Nepostojeci korisnik ");
            }
            if (korisnik.profilnaSlika == novaslika)
            {
                return BadRequest("Ista slika");
            }

            try
            {
                korisnik.profilnaSlika = novaslika;
                await Context.SaveChangesAsync();
                return Ok("Profilna slika je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PromeniPasswordKorisniku/{jwt}/{currentpass}/{newpass}/{confirmnewpass}")]
        [HttpPut]
        public async Task<ActionResult> PromeniPasswordKorisniku(string jwt, string currentpass, string newpass, string confirmnewpass)
        {

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje korisnika 

            var korisnik = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
            if ( korisnik == null )
            {
                return BadRequest("Nepostojeci korisnik ");
            }

            if(string.Compare(korisnik.lozinka, currentpass) != 0)
            {
                return BadRequest("Trenutni password nije validan!");
            }
            if ( korisnik.lozinka == newpass && korisnik.lozinka == confirmnewpass)
            {
                return BadRequest("Novi i stari pass moraju da se razlikuju !");
            }

            if(string.Compare(newpass, confirmnewpass) != 0)
            {
                return BadRequest("Novi password se ne slaze!");
            }

            try
            {
                korisnik.lozinka = newpass;
                await Context.SaveChangesAsync();
                return Ok("Password je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiIDClanovaOrganizacije/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanovaOrganizacije(string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikovanje korisnika 

                var korisnik1 = await Context.Korisnici.Where( k => k.ID == userID).FirstOrDefaultAsync();
                if ( korisnik1 == null )
                {
                    return BadRequest("Nepostojeci korisnik ");
                }

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                    .Include(k => k.clanoviOrganizacije).ToListAsync();

                var clanovi = korisnik[0].clanoviOrganizacije
                    .Select(c => new
                    {
                        id = c.ID
                    }).ToList();

                return Ok(clanovi);
                
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        /*[Route("VratiIDClanovaTima/{clanorgID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanovaTima(int clanorgID ,string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);


                var korisnik = await Context.ClanoviOrganizacije.Where(c => c.ID == clanorgID)
                    .Include(c => c.clanoviTima).ToListAsync();

                var clanovi = korisnik[0].clanoviTima
                    .Select(c => new
                    {
                        id = c.ID
                    }).ToList();

                return Ok(clanovi);
                
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }*/

        [Route("ProveriVodju/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> ProveriVodju(string jwt)
        {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(false);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikovanje clana 

                var clanTima = await Context.ClanoviTima.Where( k => k.ID == userID).FirstOrDefaultAsync();
                if ( clanTima == null )
                {
                    return BadRequest("Nepostojeci Clan ");
                }

                return Ok(clanTima.vodjaTima);


        } 
    }
}



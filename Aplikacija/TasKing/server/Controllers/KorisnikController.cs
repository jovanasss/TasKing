using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Models;

namespace TasKing.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KorisnikController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        public KorisnikController(TasKingContext context)
        {
            Context = context;
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

                        if(string.IsNullOrWhiteSpace(korisnik.brTelefona) || korisnik.brTelefona.Length > 20 || korisnik.brTelefona.Any(Char.IsControl))
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
                            return Ok(podaci);

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
                return BadRequest("Nalog sa unetim email-om vec postoji!");
            }
        }

        [Route("UlogujKorisnika")]
        [HttpPost]
        public async Task<ActionResult> UlogujKorisnika([FromBody] KorisnikDTO user){
            try{
                Korisnik k1 = await Context.Korisnici.Where(k => k.korisnickoIme == user.korisnickoIme).FirstOrDefaultAsync();
                if(k1 == null || k1.lozinka != user.lozinka){
                    return Ok(0); // nepostojeci korisnik
                }
                else{
                    var podaci = new
                    {
                        korisnickoIme = k1.korisnickoIme,
                        lozinka = k1.lozinka,
                        id = k1.ID
                    };
                    return Ok(podaci);
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }




        [Route("VratiClanoveOrganizacije/{korisnikID}")]

        [HttpGet]

        public async Task<ActionResult> VratiClanoveOrganizacije(int korisnikID)

        {    
                 try
                {
                    Korisnik korisnik = await Context.Korisnici.Where(k => k.ID == korisnikID).FirstOrDefaultAsync();

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
                                slika = p.organizacija.slika
                            }).ToArrayAsync();               
                            return Ok(clanInfo);

                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("VratiKorisnika/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiKorisnika(int userID)
        {
            try
            {
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

                return Ok(korisnici);
            }

            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("PromeniUsernameKorisniku/{userID}/{newusername}")]
        [HttpPut]
        public async Task<ActionResult> PromeniUsernameKorisniku(int userID, string newusername)
        {
            var korisnik = await Context.Korisnici.Where(kor => kor.ID == userID).FirstOrDefaultAsync();

            if(korisnik == null)
            {
                return BadRequest("Korisnik ne postoji!");
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

        [Route("PromeniBrTelefonaKorisniku/{userID}/{novibrtelefona}")]
        [HttpPut]
        public async Task<ActionResult> PromeniBrTelefonaKorisniku(int userID, string novibrtelefona)
        {
            var korisnik = await Context.Korisnici.Where(kor => kor.ID == userID).FirstOrDefaultAsync();

            if(korisnik == null)
            {
                return BadRequest("Korisnik ne postoji!");
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

        [Route("PromeniSlikuKorisniku/{userID}/{novaslika}")]
        [HttpPut]
        public async Task<ActionResult> PromeniSlikuKorisniku(int userID, string novaslika)
        {
            var korisnik = await Context.Korisnici.Where(kor => kor.ID == userID).FirstOrDefaultAsync();

            if(korisnik == null)
            {
                return BadRequest("Korisnik ne postoji!");
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

        [Route("PromeniPasswordKorisniku/{userID}/{currentpass}/{newpass}/{confirmnewpass}")]
        [HttpPut]
        public async Task<ActionResult> PromeniPasswordKorisniku(int userID, string currentpass, string newpass, string confirmnewpass)
        {
            var korisnik = await Context.Korisnici.Where(kor => kor.ID == userID).FirstOrDefaultAsync();

            if(korisnik == null)
            {
                return BadRequest("Korisnik ne postoji!");
            }

            if(string.Compare(korisnik.lozinka, currentpass) != 0)
            {
                return BadRequest("Trenutni password nije validan!");
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

        [Route("VratiIDClanovaOrganizacije/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanovaOrganizacije(int userID)
        {
            try
            {
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

        [Route("VratiIDClanovaTima/{clanorgID}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanovaTima(int clanorgID)
        {
            try
            {
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
        } 
    }
}



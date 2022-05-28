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
        public async Task<ActionResult> OtvoriNalog([FromBody] Korisnik korisnik)
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
                                profilnaSlika = korisnik.profilnaSlika,
                                brTelefona = korisnik.brTelefona
                            };

                            Context.Korisnici.Add(korisnik1);
                            await Context.SaveChangesAsync();
                            return Ok("Sve je OK!");
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

        [Route("VratiClanoveOrganizacije/{korisnickoIme}/{lozinka}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveOrganizacije(string korisnickoIme, string lozinka)
        {     
                 try
                {
                    Korisnik korisnik = await Context.Korisnici.Where(k => k.korisnickoIme == korisnickoIme).FirstOrDefaultAsync();
                    if(korisnik==null || korisnik.lozinka!=lozinka)
                        {
                                return BadRequest("Uneli ste pogresno korisnicko ime ili lozinku");
                        }

                    var clanInfo = await Context.ClanoviOrganizacije
                            .Include(p=>p.organizacija)
                            .Where(p=>p.korisnik==korisnik && p.izbacen==false)
                            .Select(p=>
                            new{
                                imeOrganizacije = p.organizacija.ime,
                                administrator = p.administrator,
                                vremePosecivanja = p.vremePosecivanja
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
    }
}



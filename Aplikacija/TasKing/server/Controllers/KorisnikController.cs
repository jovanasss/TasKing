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

        [Route("PreuzetiKorisnike")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKorisnike()
        {
            try
            {
                var korisnici = await Context.Korisnici.ToListAsync();
                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
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

                        try
                        {
                            Korisnik korisnik1 = new Korisnik
                            {
                                ime = korisnik.ime,
                                prezime = korisnik.prezime,
                                korisnickoIme = korisnik.korisnickoIme,
                                lozinka = korisnik.lozinka,
                                email = korisnik.email,
                                profilnaSlika = korisnik.profilnaSlika
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

        [Route("VratiClanove/{korisnickoIme}/{lozinka}")]
        [HttpGet]
        public async Task<ActionResult> VratiRezervacije(string korisnickoIme, string lozinka)
        {     
                 try
                {
                    Korisnik korisnik = await Context.Korisnici.Where(k => k.korisnickoIme == korisnickoIme).FirstOrDefaultAsync();
                    if(korisnik==null || korisnik.lozinka!=lozinka)
                        {
                                return BadRequest("Uneli ste pogresno korisnicko ime ili lozinku");
                        }

                    var clanovi = korisnik.clanoviOrganizacije;
                    return Ok(clanovi);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("KreirajOrganizaciju")]
        [HttpPost]
        public async Task<ActionResult> KreirajOrganizaciju([FromBody] Organizacija organizacija)
        {
            var org = Context.Organizacije.Where(o => o.ime == organizacija.ime).FirstOrDefault();
            if(org == null)
            {
                 if(string.IsNullOrWhiteSpace(organizacija.ime) || organizacija.ime.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Organizacija organizacija1 = new Organizacija
                            {
                                ime = organizacija.ime,
                                datumOsnivanja = DateTime.Now,
                                aktivna=true,
                                slika = organizacija.slika
                            };

                            Context.Organizacije.Add(organizacija1);
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
                return BadRequest("Organizacija sa unetim imenom vec postoji!");
            }
        }

        [Route("UclaniUOrganizaciju/{korisnikID}/{OrganizacijaID}/{administrator}")]
        [HttpPost]
        public async Task<ActionResult> Upisi(int korisnikID, int OrganizacijaID, bool administrator)
        {     
                Korisnik korisnik = await Context.Korisnici.Where(p => p.ID == korisnikID).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest("Korisnik ne postoji u bazi");

                Organizacija organizacija = await Context.Organizacije.Where(p => p.ID == OrganizacijaID).FirstOrDefaultAsync();
                if(organizacija==null)
                    return BadRequest("Organizacija ne postoji u bazi");

                ClanOrganizacije clan =  await Context.ClanoviOrganizacije.Where(p => p.korisnik.ID == korisnikID && p.organizacija.ID == OrganizacijaID).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        
                        {
                            ClanOrganizacije clan1 = new ClanOrganizacije()
                            {
                                administrator=administrator,
                                izbacen = false,
                                korisnik = korisnik,
                                organizacija = organizacija
                            };

        

                            Context.ClanoviOrganizacije.Add(clan1);
                            await Context.SaveChangesAsync(); 

                            /*var rezervacijaInfo = await Context.Rezervacije
                        .Include(p => p.Sobe)
                        .Include(p => p.Korisnik)
                        .Where(p => p.Korisnik.Mejl == mejl)
                        .Select(p=>
                        new{
                                Ime = p.Korisnik.Ime,
                                Prezime = p.Korisnik.Prezime,
                                DatumP = p.DatumPrijavljivanja,
                                DatumO = p.DatumOdjavljivanja,
                                Sobe = p.Sobe.Select(s=>new{
                                naziv = s.Naziv,
                                hotel = s.Hotel.Naziv
                            }),
                                id = p.ID,
                                korisnikId = korisnik.ID
                        }).ToListAsync();*/

                            return Ok(clan);
                        }
                    }
                    catch(Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                else
                {
                    return BadRequest("Korisnik je vec uclanjen u organizaciju");
                }
        }
    }
}

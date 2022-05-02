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

                        if(string.IsNullOrWhiteSpace(korisnik.korisnickoIme) || korisnik.korisnickoIme.Length > 20 || korisnik.korisnickoIme.Any(Char.IsDigit))
                        {
                           return BadRequest("Korisnicko ime je prazno ili sadrzi cifru ili je duze od 20!");
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
    }
}

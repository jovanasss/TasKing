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
    public class OrganizacijaController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        private readonly JwtService jwtService ;

        public OrganizacijaController(TasKingContext context , JwtService JwtService)
        {
            Context = context;
            jwtService = JwtService;
        }

        [Route("KreirajOrganizaciju/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> KreirajOrganizaciju([FromBody] OrganizacijaDTO organizacija ,string jwt)
        {

            // verifikujemo token

             var token = jwtService.Verify(jwt);

             if ( token == null)
             {
                return BadRequest(-2);
             }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo korisnika 

            var korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
            if (korisnik == null)
            {
                return BadRequest("Nevalidan Korisnik");
            }

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
                                aktivna = true,
                                slika = organizacija.slika,
                                kod = organizacija.kod
                            };

                            Context.Organizacije.Add(organizacija1);
                            await Context.SaveChangesAsync();
                            return Ok(organizacija1.ID);
                        }

                        catch(Exception e)
                        {
                             return BadRequest("Doslo je do greske:" + e.Message);
                        }
            }
            else
            {
                return Ok(0);
            }
        }

        [Route("UclaniUOrganizaciju/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> UclaniUOrganizaciju([FromBody] ClanOrganizacijeDTO clanorganizacije ,string jwt)
        {     
            // verifikujemo token

             var token = jwtService.Verify(jwt);

             if ( token == null)
             {
                return BadRequest(-2);
             }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo korisnika 

            var korisnikProvera = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
            if (korisnikProvera == null)
            {
                return BadRequest("Nevalidan Korisnik");
            }

                Korisnik korisnik = await Context.Korisnici.Where(p => p.ID == clanorganizacije.idKorisnika).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest("Korisnik ne postoji u bazi");

                Organizacija organizacija = await Context.Organizacije.Where(p => p.ID == clanorganizacije.idOrganizacije).FirstOrDefaultAsync();
                if(organizacija==null)
                    return BadRequest("Organizacija ne postoji u bazi");

                ClanOrganizacije clan =  await Context.ClanoviOrganizacije.Where(p => p.korisnik.ID == clanorganizacije.idKorisnika && p.organizacija.ID == clanorganizacije.idOrganizacije).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanOrganizacije clan1 = new ClanOrganizacije()
                            {
                                administrator= clanorganizacije.admin,
                                izbacen = false,
                                korisnik = korisnik,
                                organizacija = organizacija
                            };

                            Context.ClanoviOrganizacije.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviOrganizacije
                            .Include(p=>p.organizacija)
                            .Where(p=>p.korisnik.ID==clanorganizacije.idKorisnika && p.organizacija.ID==clanorganizacije.idOrganizacije && p.izbacen==false).ToArrayAsync();
                        
                            return Ok(clan1.ID);
                        }
                    }
                    catch(Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                else
                {
                    if(clan.izbacen == true)
                    {
                        clan.izbacen=false;
                        await Context.SaveChangesAsync();
                    }
                    return Ok(clan.ID);
                }
        }

        [Route("VratiClanoveTima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveTima(string jwt)
        {     
                 try
                {

                    // verifikujemo token

                    var token = jwtService.Verify(jwt);

                    if ( token == null)
                    {
                        return BadRequest(-2);
                    }
                    int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    // verifikujemo korisnika 

                    var clan = await Context.ClanoviOrganizacije.Where(k => k.ID == clanID).FirstOrDefaultAsync();
                    if (clan == null)
                    {
                        return BadRequest("Nevalidan Korisnik");
                    }

                    ClanOrganizacije clanOrg = await Context.ClanoviOrganizacije.Where(c => c.ID == clanID).FirstOrDefaultAsync();
                    if(clanOrg==null)
                        {
                            return BadRequest("ne postoji dato clanstvo");
                        }

                    var clanInfo = await Context.ClanoviTima
                            .Include(p=>p.tim)
                            .Where(p=>p.clanOgranizacije==clanOrg && p.izbacen==false)
                            .Select(p=>
                            new{
                                idClan = p.ID,
                                idTima = p.tim.ID,
                                imeTima = p.tim.ime,
                                vodja = p.vodjaTima,
                                vremePosecivanja = p.vremePosecivanja,
                                slika = p.tim.slika,
                                kod = p.tim.kod
                            }).ToArrayAsync();
                        
                            return Ok(clanInfo);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }
        
        
        [Route("VratiOrganizacijeKorisnika/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizacijeKorisnika(string jwt)
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

                var korisnikProvera = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnikProvera == null)
                {
                    return BadRequest("Nepostojeci korisnik");
                }

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.clanoviOrganizacije.Where(c => c.izbacen == false))
                .ThenInclude(c => c.organizacija)
                .ToListAsync();

                var org = korisnik[0].clanoviOrganizacije
                     .Select(clan => new {
                      id = clan.organizacija.ID,
                      ime = clan.organizacija.ime,
                      slika = clan.organizacija.slika
                  }).ToList();

                return Ok(org);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiOrganizaciju/{kod}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizaciju(string kod ,string jwt)
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

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnik == null)
                {
                    return BadRequest("Nevalidan Korisnik");
                }       

                var organizacija = await Context.Organizacije.Where(k => k.kod == kod).FirstOrDefaultAsync();
                if (organizacija == null)
                {
                    return BadRequest("Nepostojeca organizacija");
                }
                return Ok(organizacija.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }

        [Route("VratiOrganizacijuClana/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizacijuClana(string jwt)
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

                var clan = await Context.ClanoviOrganizacije.Where(c => c.ID == userID)
                .Include(o => o.organizacija)
                .FirstOrDefaultAsync();
                if(clan == null)
                {
                    return BadRequest("Nevalidan clan");
                }

                return Ok(clan.organizacija.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiOrganizacijuTim/{timID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizaciju(int timID,string jwt)
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

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnik == null)
                {
                    return BadRequest("Nevalidan Korisnik");
                }

                var tim = await Context.Timovi.Where(k => k.ID == timID)
                .Include(p => p.organizacija)
                .FirstOrDefaultAsync();
                if (tim == null)
                {
                    return BadRequest("Nepostojeci Tim");
                }

                //var organizacija = tim.organizacija ;


                return Ok(tim.organizacija.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiPoziveIzOrganizacije/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiPoziveIzOrganizacije(string jwt)
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

                var korisnikProvera = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnikProvera == null)
                {
                    return BadRequest("Nepostojeci korisnik");
                }
                
                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.primljeniPoziviIzOrganizacije.Where(p => p.prihvacen == false))
                .ThenInclude(p => p.organizacija)
                .ToListAsync();

                var organizacije = korisnik[0].primljeniPoziviIzOrganizacije
                    .Select(p => new
                    {
                        id = p.organizacija.ID,
                        ime = p.organizacija.ime,
                        slika = p.organizacija.slika,
                        vremepoziva = p.vremePoziva
                    }).ToList();
                return Ok(organizacije);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("IzbaciKorisnikaIzOrganizacije/{jwt}/{orgID}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciKorisnikaIzOrganizacije(string jwt, int orgID)
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

                // verifikovanje organizacije

                var organizacijaProvera = await Context.Organizacije.Where(o => o.ID == orgID).FirstOrDefaultAsync();
                if (organizacijaProvera == null)
                {
                    return BadRequest("Nepostojeca Organizacija");
                }

                // verifikovanje clana

                var clanorg = await Context.ClanoviOrganizacije.Where(c => c.korisnik.ID == userID && c.organizacija.ID == orgID).FirstOrDefaultAsync();
                if(clanorg == null)
                {
                    return BadRequest("Clan organizacije ne postoji!");
                }

                clanorg.izbacen = true;
                await Context.SaveChangesAsync();
                return Ok(clanorg);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }
        
        // proveriti clan je vec uclanjen

        [Route("PrihvatiPozivUOrganizaciju/{jwt}/{orgID}")]
        [HttpPut]
        public async Task<ActionResult> PrihvatiPozivUOrganizaciju(string jwt, int orgID)
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

                // verifikovanje organizacije

                var organizacijaProvera = await Context.Organizacije.Where(o => o.ID == orgID).FirstOrDefaultAsync();
                if (organizacijaProvera == null)
                {
                    return BadRequest("Nepostojeca Organizacija");
                }

                var clanOrganizacije = await Context.ClanoviOrganizacije.Where(c => c.organizacija.ID == orgID && c.korisnik.ID == userID).FirstOrDefaultAsync();
                 if (clanOrganizacije != null)
                    {
                        return BadRequest(-1);
                    }

                // verifikacija poziva 

                var poziv = await Context.PoziviUOrganizaciju.Where(p => p.pozvaniKorisnik.ID == userID && p.organizacija.ID == orgID).FirstOrDefaultAsync();
                if(poziv == null)
                {
                    return BadRequest("Poziv ne postoji!");
                }

                poziv.prihvacen = true;
                await Context.SaveChangesAsync();
                return Ok(poziv);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("OdbijPozivUOrganizaciju/{jwt}/{orgID}")]
        [HttpDelete]
        public async Task<ActionResult> OdbijPozivUOrganizacije(string jwt, int orgID)
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

                // verifikovanje organizacije

                var organizacijaProvera = await Context.Organizacije.Where(o => o.ID == orgID).FirstOrDefaultAsync();
                if (organizacijaProvera == null)
                {
                    return BadRequest("Nepostojeca Organizacija");
                }

                // verifikacija poziva 

                var poziv = await Context.PoziviUOrganizaciju.Where(p => p.pozvaniKorisnik.ID == userID && p.organizacija.ID == orgID).FirstOrDefaultAsync();
                if(poziv == null)
                {
                    return BadRequest("Poziv ne postoji!");
                }

                Context.PoziviUOrganizaciju.Remove(poziv);
                await Context.SaveChangesAsync();
                return Ok("Poziv je uspesno obrisan!");
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiIDClanaOrganizacije/{jwt}/{orgID}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanaOrganizacije(string jwt, int orgID)
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

                var korisnikProvera = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnikProvera == null)
                {
                    return BadRequest("Nepostojeci korisnik");
                }

                // verifikovanje organizacije

                var organizacijaProvera = await Context.Organizacije.Where(o => o.ID == orgID).FirstOrDefaultAsync();
                if (organizacijaProvera == null)
                {
                    return BadRequest("Nepostojeca Organizacija");
                }

                // verifikovanje clana 

                var clanorg = await Context.ClanoviOrganizacije.Where(c => c.korisnik.ID == userID && c.organizacija.ID == orgID).FirstOrDefaultAsync();
                if(clanorg == null)
                {
                    return BadRequest("Clan organizacije ne postoji!");
                }
  
                return Ok(clanorg.ID);
                
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
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
                    int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    // verifikujemo korisnika 

                    var clan = await Context.ClanoviOrganizacije.Where(p => p.ID == clanID)
                    .Include(c => c.organizacija)
                    .Select(clan => new{
                        orgID = clan.organizacija.ID
                    }).FirstOrDefaultAsync();

                    if(clan==null)
                    {
                        return BadRequest("nepostojeci clan");
                    }
                    
                    var clanovi = await Context.ClanoviOrganizacije.Where(p => p.organizacija.ID == clan.orgID && p.ID != clanID && p.izbacen==false)
                    .Include(c =>c.korisnik)
                    .Select(clan => new{
                        clanOrgID = clan.ID,
                        admin = clan.administrator, 
                        Korisnik = clan.korisnik
                    })
                    .ToListAsync();
                    
                     return Ok(clanovi);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("IzbaciClana/{ClanID}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciClana(int ClanID, string jwt)
        {

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju

            var clanOrganizacije = await Context.ClanoviOrganizacije.Where(k => k.ID == userID).Include(c => c.organizacija).FirstOrDefaultAsync();
            if(clanOrganizacije == null)
            {
                return BadRequest("Nevalidan clan");
            }
            if(clanOrganizacije.administrator == false)
            {
                return BadRequest("Nisi admin");
            }

            // verifikujemo clana 

            var clanProvera = await Context.ClanoviOrganizacije.Where(c => c.ID == ClanID).Include(c => c.organizacija).FirstOrDefaultAsync();
            if (clanProvera == null)
            {
                 return BadRequest("Nepostojeci clan");
            }

            if (clanOrganizacije.organizacija.ID != clanProvera.organizacija.ID)
            {
                return BadRequest("Niste u toj organizaciji");
            }

            if (userID == ClanID)
            {
                return BadRequest("Ne mozete da izbacite samog sebe");
            }

            if (clanOrganizacije.ID == ClanID)
            {
                return BadRequest("Ne mozete da izbacite vodju");
            }


                try
                {
                    var clan =  Context.ClanoviOrganizacije.Where(c=>c.ID==ClanID).FirstOrDefault();  
                    if(clan!=null)
                    {
                        clan.izbacen = true;
                        await Context.SaveChangesAsync(); 
                    }
                    return Ok();
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("PromeniSlikuOrganizacije/{orgID}/{novaslika}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> PromeniSlikuOrganizacije(int orgID, string novaslika, string jwt)
        {

            var token = jwtService.Verify(jwt);
             if ( token == null)
            {
                 return BadRequest(-2);
            }

            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviOrganizacije.Where(k => k.ID == userID).Include(c => c.organizacija).FirstOrDefaultAsync();
            if(vodja == null)
            {
                return BadRequest("Nevalidan Vodja");
            } 
            if(vodja.administrator == false)
            {
                return BadRequest("Nisi vodja");
            }
            var org = await Context.Organizacije.Where(o => o.ID == orgID).FirstOrDefaultAsync();

            if(org == null)
            {
                return BadRequest("Organizacija ne postoji!");
            }

            if (vodja.organizacija.ID != orgID)
            {
                return BadRequest("Niste u toj organizaciji");
            }

            try
            {
                org.slika = novaslika;
                await Context.SaveChangesAsync();
                return Ok("Slika je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PozoviUOrganizaciju/{korisnickoIme}/{orgID}/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> PozoviUOrganizaciju(string korisnickoIme, int orgID, string jwt)
        {     


             // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                 return BadRequest(-2);
            }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju

            var vodja = await Context.ClanoviOrganizacije.Where(k => k.ID == userID).Include(c => c.organizacija).FirstOrDefaultAsync();
            if(vodja == null)
            {
                return BadRequest("Nevalidan vodja");
            }
            if(vodja.administrator == false)
            {
                return BadRequest("Nisi vodja");
            }

            if (vodja.organizacija.ID != orgID)
            {
                return BadRequest("Niste u toj organizaciji");
            }
            
                Korisnik korisnik = await Context.Korisnici.Where(p => p.korisnickoIme == korisnickoIme).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest(1);

                Organizacija organizacija = await Context.Organizacije.Where(p => p.ID == orgID).FirstOrDefaultAsync();
                if(organizacija==null)
                    return BadRequest(2);

                ClanOrganizacije clan = await Context.ClanoviOrganizacije.Where(p => p.organizacija == organizacija && p.korisnik == korisnik && p.izbacen==false).FirstOrDefaultAsync();
                if(clan==null)
                {
                    PozivUOrganizaciju poziv = await Context.PoziviUOrganizaciju.Where(p => p.pozvaniKorisnik == korisnik && p.organizacija == organizacija).FirstOrDefaultAsync();
                    if(poziv==null)
                    {
                        try
                        {
                            {
                                PozivUOrganizaciju poziv1 = new PozivUOrganizaciju()
                                {
                                    pozvaniKorisnik= korisnik,
                                    vremePoziva = DateTime.Now,
                                    prihvacen = false,
                                    organizacija = organizacija
                                };

                                Context.PoziviUOrganizaciju.Add(poziv1);
                                await Context.SaveChangesAsync(); 

                                return Ok();
                            }
                        }
                        catch(Exception e)
                        {
                            return BadRequest(e.Message);
                        }
                    }
                    else
                    {
                        if(poziv.prihvacen==true)
                        {
                            poziv.prihvacen=false;
                            await Context.SaveChangesAsync();
                            return Ok();
                        }
                        else
                        {
                            return BadRequest(3);
                        }
                    }
                }
                else
                {
                    return BadRequest(4);
                }
        }

        [Route("UlogujClanaOrganizacije/{idClana}/{userToken}")]
        [HttpPost]
        public async Task<ActionResult> UlogujClanaOrganizacije(int idClana,string userToken){
            try{

                // verifikujemo token

                var token = jwtService.Verify(userToken);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                 // verifikujemo korisnika 

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnik == null)
                {
                    return BadRequest("Nevalidan Korisnik");
                }

                ClanOrganizacije c1 = await Context.ClanoviOrganizacije.Where(k => k.ID == idClana).FirstOrDefaultAsync();
                if(c1 == null){
                    return Ok(0); // nepostojeci korisnik
                }
                else{
                    var jwt = new
                     {
                        value = jwtService.Generate(c1.ID)
                     };

                    return Ok(jwt);
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Route("VratiIDClanaOrganizacije/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanaOrganizacije(string jwt)
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

                var korisnici = await Context.ClanoviOrganizacije
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    id = k.ID,      
 
                }).FirstOrDefaultAsync();
                if (korisnici == null)
                {
                    return BadRequest("Nevalidan korisnik");
                }

                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("ORGCodeCheck/{code}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> ORGCodeCheck (string code , string jwt)
        {

                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                
                // verifikujemo korisnika 

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID).FirstOrDefaultAsync();
                if (korisnik == null)
                {
                    return BadRequest(-1);
                }

                var org = await Context.Organizacije.Where(o => o.kod == code).FirstOrDefaultAsync(); 

                if (org != null){
                    return Ok("true");
                }
                else{
                    return Ok("false");
                }
        }

        // proveriti administratora 

        [Route("VratiKodOrganizacije/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiKodOrganizacije(string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikujemo vodju

                var vodja = await Context.ClanoviOrganizacije.Where(k => k.ID == clanID).FirstOrDefaultAsync();
                if(vodja == null)
                {
                    return BadRequest("Invalidan vodja");
                }
                if(vodja.administrator == false)
                {
                    return BadRequest("Nisi vodja");
                }

                var clan = await Context.ClanoviOrganizacije
                .Where(k => k.ID == clanID && k.administrator == true)
                .Include(c => c.organizacija)
                .Select(k => new
                {
                    kod =   k.organizacija.kod
 
                }).FirstOrDefaultAsync();

                return Ok(clan);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("VratiAdminStatus/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiAdminStatus(string jwt)
        {
            try
            {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikujemo vodju

                var clanProvera = await Context.ClanoviOrganizacije.Where(k => k.ID == clanID).FirstOrDefaultAsync();
                if(clanProvera == null)
                {
                    return BadRequest("Invalidan Clan");
                }

                var clan = await Context.ClanoviOrganizacije
                .Where(k => k.ID == clanID)
                .Select(k => new
                {
                    admin =   k.administrator
 
                }).FirstOrDefaultAsync();

                return Ok(clan);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }
    }
}
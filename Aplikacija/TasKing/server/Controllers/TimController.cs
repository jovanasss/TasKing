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
    public class TimController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        private readonly JwtService jwtService ;

        public TimController(TasKingContext context , JwtService JwtService)
        {
            Context = context;
            jwtService = JwtService;
        }

        [Route("KreirajTim/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> KreirajTim([FromBody] TimDTO tim , string jwt)
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

            // verifikovanje organizacije

            var org = await Context.Organizacije.Where(p=> p.ID == tim.idOrganizacije).FirstOrDefaultAsync();
            if(org == null)
            {
                return BadRequest("Nepostojeca organizacija");
            }

            var clanOrg = await Context.ClanoviOrganizacije.Where(c => c.organizacija.ID == tim.idOrganizacije && c.korisnik.ID == userID).FirstOrDefaultAsync();;
            if(clanOrg == null)
            {
                return BadRequest("Korisnik nije clan organizacije");
            }

            var t = await Context.Timovi.Where(p => p.ime == tim.ime && p.organizacija.ID == tim.idOrganizacije).FirstOrDefaultAsync();
            if(t == null)
            {
                 if(string.IsNullOrWhiteSpace(tim.ime) || tim.ime.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Tim tim1 = new Tim
                            {
                                ime = tim.ime,
                                datumOsnivanja = DateTime.Now,
                                aktivan = true,
                                slika = tim.slika,
                                kod = tim.kod,
                                organizacija = org         
                            };

                            Context.Timovi.Add(tim1);
                            await Context.SaveChangesAsync();
                            return Ok(tim1.ID);
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


        [Route("UclaniUTim/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> UclaniUTim([FromBody] ClanTimaDTO clantima , string jwt)
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
                   

                ClanOrganizacije clanOrganizacije = await Context.ClanoviOrganizacije.Where(p => p.ID == clantima.idClanaOrganizacije && p.korisnik.ID == userID).FirstOrDefaultAsync();
                if(clanOrganizacije==null)
                    return BadRequest("Korisnik nije clan organizacije");

                Tim tim = await Context.Timovi.Where(p => p.ID == clantima.idtima).FirstOrDefaultAsync();
                if(tim==null)
                    return BadRequest("Tim ne postoji u bazi");

                ClanTima clan =  await Context.ClanoviTima.Where(p => p.clanOgranizacije.ID == clantima.idClanaOrganizacije && p.tim.ID == clantima.idtima).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanTima clan1 = new ClanTima
                            {
                                vodjaTima= clantima.vodja,
                                izbacen = false,
                                clanOgranizacije = clanOrganizacije,
                                tim = tim
                            };

                            Context.ClanoviTima.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviTima
                            .Include(p=>p.tim)
                            .Where(p=>p.clanOgranizacije.ID==clantima.idClanaOrganizacije && p.tim.ID==clantima.idtima && p.izbacen==false).ToArrayAsync();
                        
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
                    if(clan.izbacen ==true)
                    {
                        clan.izbacen=false;
                        await Context.SaveChangesAsync();
                        return Ok(clan.ID);
                    }
                    else
                    {
                        return BadRequest("Korisnik je vec uclanjen u tim");
                    }
                }
        }

        [Route("VratiProjekteTima/{timID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteTima(int timID ,string jwt)
        {     
                 try
                {

                    // verifikujemo token

                    var token = jwtService.Verify(jwt);

                    if ( token == null){
                        return BadRequest(-2);
                    }
                    int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    Tim tim = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();
                    if(tim==null)
                    {
                        return BadRequest("ne postoji dati tim");
                    }

                    var clan = await Context.ClanoviTima.Where(c => c.ID == clanID).Include(c => c.tim).FirstOrDefaultAsync(); // && c.tim.ID==timID

                    if(clan == null)
                    {
                        return BadRequest(-3);
                    }

                    var projektiInfo = await Context.Projekti
                            .Where(p=>p.tim==tim && p.aktivan==true)
                            .Select(p=>
                            new{
                                idProj = p.ID,
                                imeProj = p.naziv,
                            }).ToArrayAsync();
                        
                            return Ok(projektiInfo);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        // proveriti mozda treba jos neka provera dole za projekat 

        [Route("vratiProjekat/{projID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> vratiProjekat(int projID, string jwt)
        {     
                 try
                {
                    // verifikujemo token

                    var token = jwtService.Verify(jwt);

                    if ( token == null)
                    {
                        return BadRequest(-2);
                    }
                    int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    // verifikujemo clana

                    var clan = await Context.ClanoviTima.Where(clan => clan.ID == clanTimaID).Include(c=>c.tim).Select(clan => new{
                        vodjaTima = clan.vodjaTima,
                        tim = clan.tim
                    }).FirstOrDefaultAsync();

                    if(clan == null)
                    {
                        return BadRequest("Nevalidan Clan");
                    }

                    var projekat1 = await Context.Projekti.Where(p => p.ID == projID && p.aktivan==true).Include(p=>p.tim).FirstOrDefaultAsync();
                    if(projekat1 == null)
                    {
                        return BadRequest("Nepostojeci projekat");
                    }   

                    if(clan.tim.ID != projekat1.tim.ID)
                    {
                        return BadRequest("Korisnik nije clan tima");
                    }  

                    // verifikujemo projekat 

                    var projekatInfo = await Context.Projekti
                            .Include(p=>p.taskovi)
                            .ThenInclude(t=>t.clanTima)
                            .ThenInclude(t =>t.prijaveZaTask)
                            .ThenInclude(p =>p.clanTima)
                            .ThenInclude(c => c.clanOgranizacije)
                            .ThenInclude(co => co.korisnik)
                            .Where(p=>p.ID==projID && p.aktivan==true)
                            .Select(p=>
                            new{
                                imeProj = p.naziv,
                                opisProj = p.opis,
                                Taskovi = p.taskovi.Where(t => t.clanTima==null || t.clanTima.ID==clanTimaID || clan.vodjaTima).Select(t=>new{
                                taskID = t.ID,
                                naziv = t.naziv,
                                opisTaska = t.opis,
                                vrednost = t.vrednost,
                                status = t.status,
                                tip = t.tip,
                                prijave = t.prijaveZaTask.Where(p => p.clanTima.ID==clanTimaID),
                                //clanTimaID = t.clanTima!=null? t.clanTima.ID : -1,
                                //clanOrgID = t.clanTima!=null? (t.clanTima.clanOgranizacije!=null? t.clanTima.clanOgranizacije.ID : -1) : -1,
                                korisnikID =  t.clanTima.clanOgranizacije.korisnik!=null? t.clanTima.clanOgranizacije.korisnik.ID : -1,
                                korisnickoIme = t.clanTima.clanOgranizacije.korisnik!=null? t.clanTima.clanOgranizacije.korisnik.korisnickoIme : "",
                                slika = t.clanTima.clanOgranizacije.korisnik!=null? t.clanTima.clanOgranizacije.korisnik.profilnaSlika : ""
                            }),
                            }).FirstOrDefaultAsync(); 


                            var projekat = await Context.Projekti
                            .Include(p=>p.taskovi)
                            .ThenInclude(t=>t.clanTima)
                            .Where(p=>p.ID==projID && p.aktivan==true)
                            .Select(p=>
                            new{
                                SviTaskovi = p.taskovi.Where(t =>t.status!=-1).Select(ta => new{
                                    vrednost = ta.vrednost,
                                }),
                                TvojiTaskovi = p.taskovi.Where(t =>t.status==3  && t.clanTima!=null && t.clanTima.ID==clanTimaID).Select(ta => new{
                                    vrednost = ta.vrednost,
                                })
                            }).FirstOrDefaultAsync();
                        
                            int totalPoints = 0;
                            int yourPoints = 0;
                            foreach (var task in projekat.SviTaskovi)
                            {
                                totalPoints+=Int32.Parse(task.vrednost);
                            }

                            foreach (var task in projekat.TvojiTaskovi)
                            {
                                yourPoints+=Int32.Parse(task.vrednost);
                            }

                            float procenat = totalPoints==0? 0 : (int)((yourPoints*100)/totalPoints);
                        
                            return Ok(new{
                                projekatInfo = projekatInfo,
                                procenat = procenat
                });
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }
        
        [Route("VratiTimoveKorisnika/{clanoviorgID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimoveKorisnika(string clanoviorgID ,string jwt)
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

                String[] clanovistringID = clanoviorgID.Split(" "); 
                int[] clanoviID = Array.ConvertAll(clanovistringID, int.Parse);
                List<ClanOrganizacije> clanoviOrg = new List<ClanOrganizacije>();
                List<TimInfo> timovi = new List<TimInfo>();

                foreach(var clanid in clanoviID)
                {
                    var clanOrg = await Context.ClanoviOrganizacije.Where(clan => clan.ID == clanid && clan.korisnik.ID == userID)
                    .Include(clan => clan.clanoviTima.Where(c => c.izbacen == false && c.clanOgranizacije.izbacen == false))
                    .ThenInclude(clantima => clantima.tim)
                    .ThenInclude(tim => tim.organizacija)
                    .FirstOrDefaultAsync();
                    if(clanOrg==null)
                    {
                        return BadRequest("Nisi clan organizacije");
                    }
                    clanoviOrg.Add(clanOrg);
                }

                var c = clanoviOrg.Select(clan => new {
                    ID = clan.ID,
                    }).ToList();

                foreach(var clanorg in clanoviOrg)
                {
                    foreach(var clantima in clanorg.clanoviTima)
                    {
                        TimInfo timinfo = new TimInfo(clantima.tim.ID, clantima.tim.ime, clantima.tim.slika, clantima.tim.organizacija.ID, clantima.tim.organizacija.ime);
                        timovi.Add(timinfo);
                    }
                }

                /*var clanOrg = await Context.ClanoviOrganizacije.Where(clan => clan.ID == clanorgID)
                    .Include(clan => clan.clanoviTima.Where(c => c.izbacen == false && c.clanOgranizacije.izbacen == false))
                    .ThenInclude(clantima => clantima.tim)
                    .ThenInclude(tim => tim.organizacija)
                    .ToListAsync();

                var timovi = clan[0].clanoviTima.Select(clantima => new
                {
                    id = clantima.tim.ID,
                    ime = clantima.tim.ime,
                    slika = clantima.tim.slika,
                    organizacijaID = clantima.tim.organizacija.ID
                }).ToList();*/
                    
                return Ok(timovi);
            }
           catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }


        [Route("VratiTim/{kod}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiTim(string kod ,string jwt)
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

                var tim = await Context.Timovi.Where(k => k.kod == kod).FirstOrDefaultAsync();
                if (tim == null)
                {
                    return BadRequest("Nepostojeci Tim");
                }

                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }


        [Route("VratiTimIME/{ime}/{orgID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimIME(string ime, int orgID,string jwt)
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

                var org = await Context.Organizacije.Where( o => o.ID == orgID).FirstOrDefaultAsync();
                if(org == null)
                {
                    return BadRequest("Nepostojeca Organizacija");
                }

                var clan = await Context.ClanoviOrganizacije.Where(c => c.korisnik.ID == userID && c.organizacija.ID == orgID).FirstOrDefaultAsync();
                if (clan == null)
                {
                    return BadRequest("Korisnik nije clan organizacije");
                }

                var tim = await Context.Timovi.Where(k => k.ime == ime && k.organizacija.ID == orgID).FirstOrDefaultAsync();


                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }

       /* [Route("VratiTimClana/{clanTimaID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimClana(int clanTimaID, string jwt)
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

                var clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID)
                .Include(k =>k.tim)
                .FirstOrDefaultAsync();
                if (clan == null)
                {
                    return BadRequest("Nepostojeci clan");
                }

                return Ok(clan.tim.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }*/

        /* proveriti ovo sam mozda sjebao kada nema poziva javi se u catch 
        "Doslo je do greske:Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')"*/

        [Route("VratiPoziveIzTima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiPoziveIzTima(string jwt)
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

                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.primljeniPoziviIzTima.Where(p => p.prihvacen == false))
                .ThenInclude(p => p.tim)
                .ThenInclude(t => t.organizacija)
                .ToListAsync();
                if (korisnik == null)
                {
                    return BadRequest("Nepostojeci korisnik");
                }

                // verifikujemo tim

                var timovi = korisnik[0].primljeniPoziviIzTima
                    .Select(p => new
                    {
                        id = p.tim.ID,
                        ime = p.tim.ime,
                        slika = p.tim.slika,
                        organizacijaID = p.tim.organizacija.ID,
                        organizacijaIme = p.tim.organizacija.ime,
                        vremepoziva = p.vremePoziva
                    }).ToList();                   
                if (timovi == null)
                {
                    return BadRequest("Nepostojeci timovi");
                }   
                return Ok(timovi);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PrihvatiPozivUTim/{jwt}/{timID}")]
        [HttpPut]
        public async Task<ActionResult> PrihvatiPozivUTim(string jwt, int timID)
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

                // verifikujemo poziv

                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID).FirstOrDefaultAsync();
                if(poziv == null)
                {
                    return BadRequest("poziv ne postoji!");
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

        [Route("OdbijPozivUTim/{jwt}/{timID}")]
        [HttpDelete]
        public async Task<ActionResult> OdbijPozivUTim(string jwt, int timID)
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

                // verifikujemo poziv

                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID).FirstOrDefaultAsync();
                if(poziv == null)
                {
                    return BadRequest("Poziv ne postoji!");
                }

                Context.PoziviUTim.Remove(poziv);
                await Context.SaveChangesAsync();
                return Ok("Poziv je uspesno obrisan!");
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("IzbaciKorisnikaIzTima/{timID}/{clanorgID}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciKorisnikaIzTima(int timID, int clanorgID,string jwt)
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


                var timProvera = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();
                if (timProvera == null)
                {
                    return BadRequest("Nepostojeci tim");
                }

                var clantima = await Context.ClanoviTima.Where(c => c.tim.ID == timID && c.clanOgranizacije.ID == clanorgID && c.clanOgranizacije.korisnik.ID == userID)
                    .FirstOrDefaultAsync();

                if(clantima== null)
                {
                    return BadRequest("Nisi autorizovan!");
                }

                

                clantima.izbacen = true;
                await Context.SaveChangesAsync();
                return Ok(clantima);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
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
                    var clan = await Context.ClanoviTima.Where(k => k.ID == clanID).Include(c => c.tim).FirstOrDefaultAsync(); 
                    if(clan==null)
                    {
                        return BadRequest(-3);
                    }
                    int timID = clan.tim.ID;

                    // verifikujemo tim 

                    var timProvera = await Context.Timovi.Where( t => t.ID == timID).FirstOrDefaultAsync();
                    if(timProvera == null)
                    {
                        return BadRequest("Nepostojeci tim");
                    }

                    // verifikujemo clanove

                    var clanovi = await Context.ClanoviTima.Where(p => p.tim.ID == timID && p.ID != clanID && p.izbacen==false && p.clanOgranizacije.izbacen==false)
                    .Include(c =>c.clanOgranizacije)
                    .ThenInclude(c =>c.korisnik)
                    .Select(clan => new{
                        clanTimaID = clan.ID,
                        vodja = clan.vodjaTima,
                        clanOrgID = clan.clanOgranizacije.ID,
                        Korisnik = clan.clanOgranizacije.korisnik
                    })
                    .ToListAsync();
                    if(clanovi == null){
                        return BadRequest("Invalid");
                    }

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

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(k => k.tim).FirstOrDefaultAsync(); 
            if(vodja == null)
            {
                return BadRequest("Nepostojeci vodja");
            }

            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }

            // verifikujemo clana 

            var clan = await Context.ClanoviTima.Where(c => c.ID == ClanID).Include(c => c.tim).FirstOrDefaultAsync();
            if (clan == null)
            {
                return BadRequest("Nepostojeci clan");
            }

            if(vodja.tim.ID != clan.tim.ID)
            {
                return BadRequest("Nisi vodja u tom timu");
            }

            if(clan.ID == userID)
            {
                return BadRequest("Ne mozete da izbacite sami sebe");
            }

            if (clan.ID == vodja.ID)
            {
                return BadRequest("Ne mozete da izbacite vodju");
            }

                try
                {
                    clan.izbacen = true;
                    await Context.SaveChangesAsync(); 
                    return Ok();
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("PromeniSlikuTima/{timID}/{novaslika}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> PromeniSlikuTima(int timID, string novaslika, string jwt)
        {

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                return BadRequest(-2);
            }

            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(k=>k.tim).FirstOrDefaultAsync(); 
            if(vodja == null)
            {
                return BadRequest("Nepostojeci vodja");
            }
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }
            
            // verifikujemo tim

            var tim = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();
            if(tim == null)
            {
                return BadRequest("Tim ne postoji!");
            }

            if(vodja.tim.ID != timID)
            {
                return BadRequest("Nisi vodja toga tima");
            }

            try
            {
                tim.slika = novaslika;
                await Context.SaveChangesAsync();
                return Ok("Slika je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PozoviUTim/{korisnickoIme}/{TimID}/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> PozoviUTim(string korisnickoIme, int TimID, string jwt)
        {     
            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                return BadRequest(-2);
            }

            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(k=>k.tim).FirstOrDefaultAsync(); 
            if(vodja == null)
            {
                return BadRequest("Nepostojeci vodja");
            }
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }
            

                Korisnik korisnik = await Context.Korisnici.Where(p => p.korisnickoIme == korisnickoIme).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest(1);

                Tim tim = await Context.Timovi.Where(p => p.ID == TimID).FirstOrDefaultAsync();
                if(tim==null)
                    return BadRequest(2);

                if(vodja.tim.ID != TimID)
                {
                    return BadRequest("Nisi vodja toga tima");
                }

                ClanTima clan = await Context.ClanoviTima
                .Include(c => c.clanOgranizacije)
                .Where(p => p.tim == tim && p.clanOgranizacije.korisnik == korisnik && p.izbacen==false).FirstOrDefaultAsync();
                if(clan==null)
                {
                    PozivUTim poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik == korisnik && p.tim == tim).FirstOrDefaultAsync();
                    if(poziv==null)
                    {
                        try
                        {
                            {
                                PozivUTim poziv1 = new PozivUTim()
                                {
                                    pozvaniKorisnik= korisnik,
                                    vremePoziva = DateTime.Now,
                                    prihvacen = false,
                                    tim = tim
                                };

                                Context.PoziviUTim.Add(poziv1);
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

        [Route("UlogujClanaTima/{idClana}/{userToken}")]
        [HttpPost]
        public async Task<ActionResult> UlogujClanaTima(int idClana ,string userToken){
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
                ClanTima c1 = await Context.ClanoviTima.Where(k => k.ID == idClana).FirstOrDefaultAsync();
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

        [Route("VratiIDClanaTima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiIDClanaTima(string jwt)
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

                var korisnici = await Context.ClanoviTima
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    id = k.ID,      
 
                }).FirstOrDefaultAsync();
                if (korisnici == null)
                {
                    return BadRequest("Nevalidan Korisnik");
                }

                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("TeamCodeCheck/{code}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> TeamCodeCheck (string code, string jwt) 
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

                var tim = await Context.Timovi.Where(t => t.kod == code).FirstOrDefaultAsync(); 
                if (tim != null){
                    return Ok("true");
                }
                else{
                    return Ok("false");
                }
        }

        [Route("VratiKodTima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiKodTima(string jwt)
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

                var vodja = await Context.ClanoviTima.Where(k => k.ID == clanID).FirstOrDefaultAsync(); 
                if(vodja == null)
                {
                    return BadRequest("Nepostojeci vodja");
                }
                if(vodja.vodjaTima == false)
                {
                    return BadRequest("Nisi vodja");
                }

                var clan = await Context.ClanoviTima
                .Where(k => k.ID == clanID && k.vodjaTima == true)
                .Include(c => c.tim)
                .Select(k => new
                {
                    kod =   k.tim.kod
 
                }).FirstOrDefaultAsync();

                return Ok(clan);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("VratiVodjaStatus/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiVodjaStatus(string jwt)
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

                var clanProvera = await Context.ClanoviTima.Where(k => k.ID == clanID).FirstOrDefaultAsync();
                if(clanProvera == null)
                {
                    return BadRequest("Invalidan Clan");
                }

                var clan = await Context.ClanoviTima
                .Where(k => k.ID == clanID)
                .Select(k => new
                {
                    vodja =   k.vodjaTima
 
                }).FirstOrDefaultAsync();

                return Ok(clan);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }
    }

    public class TimInfo
    {
        public int id { get; set; }
        public string ime { get; set; }
        public string slika { get; set; }
        public int organizacijaID {  get; set; }
        public string organizacijaIme { get; set; }

        public TimInfo(int id_, string ime_, string slika_, int organizacijaID_, string organizacijaIme_)
        {
            id = id_;
            ime = ime_;
            slika = slika_;
            organizacijaID = organizacijaID_;
            organizacijaIme = organizacijaIme_;
        }
    }
}
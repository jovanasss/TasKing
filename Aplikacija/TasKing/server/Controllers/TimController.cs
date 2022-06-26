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

        [Route("KreirajTim")]
        [HttpPost]
        public async Task<ActionResult> KreirajTim([FromBody] TimDTO tim)
        {
            var org = Context.Organizacije.Where(p=> p.ID == tim.idOrganizacije).FirstOrDefault();

            var t = Context.Timovi.Where(p => p.ime == tim.ime && p.organizacija.ID == tim.idOrganizacije).FirstOrDefault();
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


        [Route("UclaniUTim")]
        [HttpPost]
        public async Task<ActionResult> UclaniUTim([FromBody] ClanTimaDTO clantima)
        {     
                ClanOrganizacije clanOrganizacije = await Context.ClanoviOrganizacije.Where(p => p.ID == clantima.idClanaOrganizacije).FirstOrDefaultAsync();
                if(clanOrganizacije==null)
                    return BadRequest("Clan organizacije ne postoji u bazi");

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
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Korisnik je vec uclanjen u tim");
                    }
                }
        }

        [Route("VratiProjekteTima/{timID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteTima(int timID)
        {     
                 try
                {
                    Tim tim = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();
                    if(tim==null)
                        {
                            return BadRequest("ne postoji dati tim");
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

        [Route("vratiProjekat/{projID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> vratiProjekat(int projID, string jwt)
        {     
                 try
                {
                    var token = jwtService.Verify(jwt);
                    int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    var clan = await Context.ClanoviTima.Where(clan => clan.ID == clanTimaID).Select(clan => new{
                        vodjaTima = clan.vodjaTima
                    }).FirstOrDefaultAsync();
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
                                SviTaskovi = p.taskovi.Select(ta => new{
                                    vrednost = ta.vrednost,
                                }),
                                TvojiTaskovi = p.taskovi.Where(t => t.clanTima!=null && t.clanTima.ID==clanTimaID).Select(ta => new{
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

                            int procenat = totalPoints==0? 0 : (int)((yourPoints*100)/totalPoints);
                        
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
        
        [Route("VratiTimoveKorisnika/{clanoviorgID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimoveKorisnika(string clanoviorgID)
        {
            try
            {
                String[] clanovistringID = clanoviorgID.Split(" "); 
                int[] clanoviID = Array.ConvertAll(clanovistringID, int.Parse);
                List<ClanOrganizacije> clanoviOrg = new List<ClanOrganizacije>();
                List<TimInfo> timovi = new List<TimInfo>();

                foreach(var clanid in clanoviID)
                {
                    var clanOrg = await Context.ClanoviOrganizacije.Where(clan => clan.ID == clanid)
                    .Include(clan => clan.clanoviTima.Where(c => c.izbacen == false && c.clanOgranizacije.izbacen == false))
                    .ThenInclude(clantima => clantima.tim)
                    .ThenInclude(tim => tim.organizacija)
                    .FirstOrDefaultAsync();
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


        [Route("VratiTim/{kod}")]
        [HttpGet]
        public async Task<ActionResult> VratiTim(string kod)
        {
            try
            {
                var tim = await Context.Timovi.Where(k => k.kod == kod).FirstOrDefaultAsync();

                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }


        [Route("VratiTimIME/{ime}/{orgID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimIME(string ime, int orgID)
        {
            try
            {
                var tim = await Context.Timovi.Where(k => k.ime == ime && k.organizacija.ID == orgID).FirstOrDefaultAsync();

                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }

        [Route("VratiTimClana/{clanTimaID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimClana(int clanTimaID)
        {
            try
            {
                var clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID)
                .Include(k =>k.tim)
                .FirstOrDefaultAsync();

                return Ok(clan.tim.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiPoziveIzTima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiPoziveIzTima(string jwt)
        {
            try
            {
                var token = jwtService.Verify(jwt);
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.primljeniPoziviIzTima.Where(p => p.prihvacen == false))
                .ThenInclude(p => p.tim)
                .ThenInclude(t => t.organizacija)
                .ToListAsync();

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
                var token = jwtService.Verify(jwt);
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID)
                    .FirstOrDefaultAsync();

                if(poziv == null)
                {
                    return BadRequest("Clan tima ne postoji!");
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
                var token = jwtService.Verify(jwt);
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID)
                    .FirstOrDefaultAsync();

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

        [Route("IzbaciKorisnikaIzTima/{timID}/{clanorgID}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciKorisnikaIzTima(int timID, int clanorgID)
        {
            try
            {
                var clantima = await Context.ClanoviTima.Where(c => c.tim.ID == timID && c.clanOgranizacije.ID == clanorgID)
                    .FirstOrDefaultAsync();

                if(clantima== null)
                {
                    return BadRequest("Clan organizacije ne postoji!");
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

        [Route("VratiClanoveTima/{timID}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveTima(int timID)
        {     
                 try
                {
                    var clanovi = await Context.ClanoviTima.Where(p => p.tim.ID == timID && p.izbacen==false && p.clanOgranizacije.izbacen==false)
                    .Include(c =>c.clanOgranizacije)
                    .ThenInclude(c =>c.korisnik)
                    .Select(clan => new{
                        clanTimaID = clan.ID,
                        clanOrgID = clan.clanOgranizacije.ID,
                        Korisnik = clan.clanOgranizacije.korisnik
                    })
                    .ToListAsync();

                     return Ok(clanovi);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("IzbaciClana/{ClanID}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciClana(int ClanID)
        {
                try
                {
                    var clan =  Context.ClanoviTima.Where(c=>c.ID==ClanID).FirstOrDefault();  
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

        [Route("PromeniSlikuTima/{timID}/{novaslika}")]
        [HttpPut]
        public async Task<ActionResult> PromeniSlikuTima(int timID, string novaslika)
        {
            var tim = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();

            if(tim == null)
            {
                return BadRequest("Tim ne postoji!");
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

        [Route("PozoviUTim/{korisnickoIme}/{TimID}")]
        [HttpPost]
        public async Task<ActionResult> PozoviUTim(string korisnickoIme, int TimID)
        {     
                Korisnik korisnik = await Context.Korisnici.Where(p => p.korisnickoIme == korisnickoIme).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest(1);

                Tim tim = await Context.Timovi.Where(p => p.ID == TimID).FirstOrDefaultAsync();
                if(tim==null)
                    return BadRequest(2);

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

        [Route("UlogujClanaTima/{idClana}")]
        [HttpPost]
        public async Task<ActionResult> UlogujClanaTima(int idClana){
            try{

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
                var token = jwtService.Verify(jwt);
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                var korisnici = await Context.ClanoviTima
                .Where(k => k.ID == userID)
                .Select(k => new
                {
                    id = k.ID,      
 
                }).FirstOrDefaultAsync();

                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return Unauthorized();
            }
        }
        [Route("TeamCodeCheck/{code}")]
        [HttpGet]
        public async Task<ActionResult> TeamCodeCheck (string code)
        {
                var tim = await Context.Timovi.Where(t => t.kod == code).FirstOrDefaultAsync(); 

                if (tim != null){
                    return Ok("true");
                }
                else{
                    return Ok("false");
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
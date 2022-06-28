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
    public class ProjekatController : ControllerBase
    {
        public TasKingContext Context { get; set; }


        private readonly JwtService jwtService ;

        public ProjekatController(TasKingContext context , JwtService JwtService)
        {
            Context = context;
            jwtService = JwtService;
        }
        
        [Route("KreirajProjekat/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> KreirajProjekat([FromBody] ProjekatDTO projekat, string jwt)
        {
            // ovde da proverimo dal je taj koj je kliknuo vodja tima posto samo on sme da kreira ??
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return Ok(1);
            }

            var proj = Context.Projekti.Where(p => p.naziv == projekat.naziv && p.tim.ID == projekat.timID).FirstOrDefault();
            if(proj == null)
            {
                 if(string.IsNullOrWhiteSpace(projekat.naziv) || projekat.naziv.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Tim tim = Context.Timovi.Where(t => t.ID == projekat.timID).FirstOrDefault();
                            Projekat projekat1 = new Projekat
                            {
                                naziv = projekat.naziv,
                                opis = projekat.opis,
                                aktivan = true,
                                tim = tim
                            };

                            Context.Projekti.Add(projekat1);
                            await Context.SaveChangesAsync();
                            return Ok(projekat1.ID);
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

        [Route("VratiProjekteSaTaskovima/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteSaTaskovima(string jwt)
        {
            try
            {
                var token = jwtService.Verify(jwt);
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                List<ProjectInfo> allProjectsInfo = new List<ProjectInfo>();
                var clanoviOrg = await Context.ClanoviOrganizacije.Where(clan => clan.korisnik.ID == userID)
                    .Include(o => o.clanoviTima)
                    .ThenInclude(t => t.tim)
                    .ThenInclude(ti => ti.projekti)
                    .ThenInclude(p => p.taskovi)
                    .ThenInclude(tas => tas.clanTima)
                    .Select(clan => new{
                        clanoviT = clan.clanoviTima.Select(clanT => new{
                            ID = clanT.ID,
                            projekti = clanT.tim.projekti.Select(proj => new{
                                ID = proj.ID,
                                naziv = proj.naziv,
                                opis = proj.opis,
                                aktivan = proj.aktivan,
                                taskovi = proj.taskovi,
                                organizacijaID = proj.tim.organizacija.ID,
                                timNaziv = proj.tim.ime
                            })
                        })
                    })
                    .ToListAsync();

                foreach (var clanO in clanoviOrg)
                {
                    foreach (var clanT in clanO.clanoviT)
                    {
                        foreach (var proj in clanT.projekti)
                        {
                            List<Models.Task> taskoviUkupni = new List<Models.Task>();
                            List<Models.Task> taskoviUradjeni = new List<Models.Task>();
                            foreach (var task in proj.taskovi)
                            {
                                if(task.status!=-1)
                                    taskoviUkupni.Add(task);
                                if(task.clanTima!=null && task.status==3)
                                {
                                    if(clanT.ID == task.clanTima.ID)
                                        taskoviUradjeni.Add(task);
                                }
                            }
                            ProjectInfo projInfo = new ProjectInfo(proj.ID, proj.naziv, proj.opis, proj.aktivan, proj.organizacijaID, proj.timNaziv, taskoviUkupni, taskoviUradjeni);
                            allProjectsInfo.Add(projInfo);
                        }
                    }
                }
                return Ok(allProjectsInfo);
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }  
        
        [Route("VratiProjekteSaTaskovima2/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteSaTaskovima(int userID)
        {
            try
            {
                List<ProjectInfo> allProjectsInfo = new List<ProjectInfo>();
                var clanoviOrg = await Context.ClanoviOrganizacije.Where(clan => clan.korisnik.ID == userID)
                    .Include(o => o.clanoviTima)
                    .ThenInclude(t => t.tim)
                    .ThenInclude(ti => ti.projekti)
                    .ThenInclude(p => p.taskovi)
                    .ThenInclude(tas => tas.clanTima)
                    .Select(clan => new{
                        clanoviT = clan.clanoviTima.Select(clanT => new{
                            ID = clanT.ID,
                            projekti = clanT.tim.projekti.Select(proj => new{
                                ID = proj.ID,
                                naziv = proj.naziv,
                                opis = proj.opis,
                                aktivan = proj.aktivan,
                                taskovi = proj.taskovi,
                                organizacijaID = proj.tim.organizacija.ID,
                                timNaziv = proj.tim.ime
                            })
                        })
                    })
                    .ToListAsync();

                foreach (var clanO in clanoviOrg)
                {
                    foreach (var clanT in clanO.clanoviT)
                    {
                        foreach (var proj in clanT.projekti)
                        {
                            List<Models.Task> taskoviUkupni = new List<Models.Task>();
                            List<Models.Task> taskoviUradjeni = new List<Models.Task>();
                            foreach (var task in proj.taskovi)
                            {
                                if(task.status!=-1)
                                    taskoviUkupni.Add(task);
                                if(task.clanTima!=null && task.status==3)
                                {
                                    if(clanT.ID == task.clanTima.ID)
                                        taskoviUradjeni.Add(task);
                                }
                            }
                            ProjectInfo projInfo = new ProjectInfo(proj.ID, proj.naziv, proj.opis, proj.aktivan, proj.organizacijaID, proj.timNaziv, taskoviUkupni, taskoviUradjeni);
                            allProjectsInfo.Add(projInfo);
                        }
                    }
                }
                return Ok(allProjectsInfo);
            }
            catch (Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }  

        [Route("VratiProjekat/{projID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekat(int projID)
        {
            var projekat = await Context.Projekti.Where(p => p.ID == projID).FirstOrDefaultAsync();

            if(projekat == null)
            {
                return BadRequest("Projekat ne postoji!");
            }
            else
            {
                return Ok(projekat);
            }
        }

        [Route("PromeniImeProjekta/{projID}/{novinaziv}/{jwt}/{timID}")]
        [HttpPut]
        public async Task<ActionResult> PromeniImeProjekta(int projID, string novinaziv, string jwt, int timID)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if (vodja == null ){
                return BadRequest("Invalid");
            }

            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }

            var projekat = await Context.Projekti.Where(p => p.ID == projID).FirstOrDefaultAsync();

            if(projekat == null)
            {
                return BadRequest(1);
            }

            var projekatstari = await Context.Projekti.Where(p => p.naziv == novinaziv && p.tim.ID == timID).FirstOrDefaultAsync();

            if(projekatstari != null)
            {
                return BadRequest(0);
            }

            try
            {
                projekat.naziv = novinaziv;
                await Context.SaveChangesAsync();
                return Ok(2);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PromeniOpisProjekta/{projID}/{noviopis}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> PromeniOpisProjekta(int projID, string noviopis, string jwt)
        {

             var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }

            var projekat = await Context.Projekti.Where(p => p.ID == projID).FirstOrDefaultAsync();

            if(projekat == null)
            {
                return BadRequest("Projekat ne postoji!");
            }

            try
            {
                projekat.opis = noviopis;
                await Context.SaveChangesAsync();
                return Ok("Opis projekta je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("ObrisiProjekat/{projID}/{jwt}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiProjekat(int projID, string jwt)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }

            try 
            { 

            var projekat = await Context.Projekti.Where(p => p.ID == projID).FirstOrDefaultAsync();

            if(projekat == null)
            {
                return BadRequest("Projekat ne postoji!");
            }
              
             foreach(var task in Context.Taskovi.Where(t => t.projekat.ID == projID))
                {
                    Context.Taskovi.Remove(task);
                }

             Context.Projekti.Remove(projekat);
             await Context.SaveChangesAsync();
             return Ok("Projekat je uspesno obrisan");
             }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiClanoveSaUcinkom/{timID}/{ProjekatID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveSaUcinkom(int timID,int ProjekatID, string jwt)
        {     
                 try
                {
                    var token = jwtService.Verify(jwt);
                    int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                    var sviTaskovi = await Context.Taskovi.Where(t => t.projekat.ID == ProjekatID && t.status!=-1).ToListAsync();

                    var clanovi = await Context.ClanoviTima.Where(p => p.tim.ID == timID && p.ID != clanID && p.izbacen==false && p.clanOgranizacije.izbacen==false)
                    .Include(c =>c.tim)
                    .ThenInclude(t =>t.projekti)
                    .ThenInclude(p =>p.taskovi)
                    .Include(c =>c.clanOgranizacije)
                    .ThenInclude(c =>c.korisnik)
                    .Select(clan => new{
                        clanTimaID = clan.ID,
                        vodja = clan.vodjaTima,
                        clanOrgID = clan.clanOgranizacije.ID,
                        Korisnik = clan.clanOgranizacije.korisnik,
                        taskovi = clan.tim.projekti.FirstOrDefault(p => p.ID == ProjekatID).taskovi.Where(t => t.status==3 && t.clanTima!=null && t.clanTima.ID==clan.ID).Select(task => new{
                            bodovi = Int32.Parse(task.vrednost)
                        })
                    })
                    .ToListAsync();

                List<MemberInfo> membersInfo = new List<MemberInfo>();

                int ukupniBodovi=0;

                foreach (var task in sviTaskovi)
                {
                    ukupniBodovi += Int32.Parse(task.vrednost);
                }

                foreach (var clan in clanovi)
                {
                    int bodovi = 0;
                    foreach (var task in clan.taskovi)
                    {
                        bodovi+=task.bodovi;
                    }
                        MemberInfo memberInfo = new MemberInfo(clan.clanTimaID, clan.vodja, clan.clanOrgID, clan.Korisnik, bodovi);
                        membersInfo.Add(memberInfo);
                }
                     return Ok(new {
                        members = membersInfo,
                        ukupniBodovi = ukupniBodovi
                     });
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }
    }
    
    public class ProjectInfo
        { 
        public int id { get; set; }
        public string naziv { get; set; }
        public string opis { get; set; }
        public bool status { get; set; }
        public int organizacijaID { get; set; }
        public string nazivTima { get; set; }
        public List<Models.Task> taskoviUkupni { get; set; }
        public List<Models.Task> taskoviUradjeni { get; set; }
        
        public ProjectInfo(int id_, string naziv_, string opis_, bool status_, int organizacijaID_, string nazivTima_, List<Models.Task> taskoviUkupni_, List<Models.Task> taskoviUradjeni_)
        {
            id = id_;
            naziv = naziv_;
            opis = opis_;
            status = status_;
            organizacijaID = organizacijaID_;
            nazivTima = nazivTima_;
            taskoviUkupni = taskoviUkupni_;
            taskoviUradjeni = taskoviUradjeni_;
        }

      }

      public class MemberInfo
        { 
        public int clanTimaID { get; set; }
        public bool vodja { get; set; }
        public int clanOrgID { get; set; }
        public Models.Korisnik Korisnik { get; set; }
        public int bodovi { get; set; }

        
        public MemberInfo(int clanTimaID_, bool vodja_, int clanOrgID_, Models.Korisnik Korisnik_, int bodovi_)
        {
            clanTimaID_ = clanTimaID_;
            vodja = vodja_;
            clanOrgID = clanOrgID_;
            Korisnik = Korisnik_;
            bodovi = bodovi_;
        }

      }
}
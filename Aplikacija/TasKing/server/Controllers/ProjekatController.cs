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
        
        [Route("KreirajProjekat")]
        [HttpPost]
        public async Task<ActionResult> KreirajProjekat([FromBody] ProjekatDTO projekat)
        {
            // ovde da proverimo dal je taj koj je kliknuo vodja tima posto samo on sme da kreira ??

            
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

       /*[Route("VratiProjekteSaTaskovima/{clantimaID}")]
       [HttpGet]
       public async Task<ActionResult> VratiProjekteSaTaskovima(int clantimaID)
       {
           try
           {
               var clan = await Context.ClanoviTima.Where(c => c.ID == clantimaID)
               .Include(c => c.tim)
               .ThenInclude(t => t.projekti)
               .ThenInclude(p => p.taskovi)
               .ThenInclude(task => task.clanTima)
               .ToListAsync();
              
              var projekti = clan[0].tim.projekti
               .Select(p => new
               {
                   id = p.ID,
                   naziv = p.naziv,
                   opis = p.opis,
                   taskoviUkupni = p.taskovi.Select(task => new
                    {
                        naziv = task.naziv,
                        opis = task.opis,
                        vrednost = task.vrednost,
                    }),
                    taskoviUradjeni = p.taskovi.Where(t => t.clanTima.ID == clantimaID).Select(p => new
                    {
                        id = p.ID,
                        naziv = p.naziv,
                        opis = p.opis,
                        vrednost = p.vrednost,
                        tip = p.tip
                    })
               }).ToList();

                return Ok(projekti);
           }
           catch(Exception e)
           {
               return BadRequest("Doslo je do greske" + e.Message);
           }
       }*/

        /*[Route("VratiProjekteSaTaskovima/{userID}")]
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
                    .ToListAsync();

                foreach (var clanO in clanoviOrg)
                {
                    foreach (var clanT in clanO.clanoviTima)
                    {
                        foreach (var proj in clanT.tim.projekti)
                        {
                            List<Models.Task> allTasks = new List<Models.Task>();
                            List<Models.Task> myTasks = new List<Models.Task>();
                            foreach (var task in proj.taskovi)
                            {
                                allTasks.Add(task);
                                if (task.clanTima == clanT)
                                    myTasks.Add(task);
                            }
                            ProjectInfo projInfo = new ProjectInfo(proj.ID, proj.naziv, proj.opis, proj.aktivan, allTasks, myTasks);
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
        }*/

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
                                organizacijaID = proj.tim.organizacija.ID
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
                            ProjectInfo projInfo = new ProjectInfo(proj.ID, proj.naziv, proj.opis, proj.aktivan, proj.organizacijaID, taskoviUkupni, taskoviUradjeni);
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
                                organizacijaID = proj.tim.organizacija.ID
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
                            ProjectInfo projInfo = new ProjectInfo(proj.ID, proj.naziv, proj.opis, proj.aktivan, proj.organizacijaID, taskoviUkupni, taskoviUradjeni);
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

        [Route("PromeniImeProjekta/{projID}/{novinaziv}")]
        [HttpPut]
        public async Task<ActionResult> PromeniImeProjekta(int projID, string novinaziv)
        {
            var projekat = await Context.Projekti.Where(p => p.ID == projID).FirstOrDefaultAsync();

            if(projekat == null)
            {
                return BadRequest("Projekat ne postoji!");
            }

            try
            {
                projekat.naziv = novinaziv;
                await Context.SaveChangesAsync();
                return Ok("Naziv projekta je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PromeniOpisProjekta/{projID}/{noviopis}")]
        [HttpPut]
        public async Task<ActionResult> PromeniOpisProjekta(int projID, string noviopis)
        {
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

        [Route("ObrisiProjekat/{projID}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiProjekat(int projID)
        {
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
    }
    
    public class ProjectInfo
        { 
        public int id { get; set; }
        public string naziv { get; set; }
        public string opis { get; set; }
        public bool status { get; set; }
        public int organizacijaID { get; set; }
        public List<Models.Task> taskoviUkupni { get; set; }
        public List<Models.Task> taskoviUradjeni { get; set; }
        

        public ProjectInfo(int id_, string naziv_, string opis_, bool status_, int organizacijaID_, List<Models.Task> taskoviUkupni_, List<Models.Task> taskoviUradjeni_)
        {
            id = id_;
            naziv = naziv_;
            opis = opis_;
            status = status_;
            organizacijaID = organizacijaID_;
            taskoviUkupni = taskoviUkupni_;
            taskoviUradjeni = taskoviUradjeni_;
        }

      }
}
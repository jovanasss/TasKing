using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using System;
using System.Security.Claims;
using JWT.Extensions.AspNetCore;

namespace Models {

    public class JwtService 
    {

        private string secureKey = "nemojte da nas hakujete";

        /*public string Generate2(int id)
        {
            var symetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));

            var credentials = new SigningCredentials(symetricSecurityKey , SecurityAlgorithms.HmacSha256Signature);
            var header = new JwtHeader(credentials);

            var payload = new JwtPayload(id.ToString() , null , null , null , DateTime.Today.AddDays(1));

            var securityToken = new JwtSecurityToken(header , payload); 

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }*/
       public string Generate(int id)

        {
            // generate token that is valid for 1 day
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secureKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
            
        }

        /*public JwtSecurityToken Verify2(string jwt) 
        {
            var tokenHandler =  new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(secureKey);

            tokenHandler.ValidateToken( jwt , new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            } , out SecurityToken validatedToken);
            
            return (JwtSecurityToken)validatedToken ;
        }*/


        public JwtSecurityToken? Verify(string token)
        {
            if (token == null) 
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secureKey);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                //var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                return  (JwtSecurityToken)validatedToken;;
            }
            catch
            {
                // return null if validation fails
                return null;
            }
        }


    }
}
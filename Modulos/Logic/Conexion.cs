using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Modulos.Logic
{
    public class Conexion
    {
        public static string ConexionString = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
    }
}
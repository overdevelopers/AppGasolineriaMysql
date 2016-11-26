using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Modulos.ViewModel
{
    public class EstadoTanquesViewModel
    {
        public int Id { get; set; }
        public string Combustible { get; set; }
        public decimal Capacidad { get; set; }
        public decimal Actual { get; set; }
        public decimal Lleno { get; set; }
        public string Color { get; set; }
    }
}
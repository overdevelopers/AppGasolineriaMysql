using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Modulos.ViewModel
{
    public class ListadoVentasViewModel
    {
        public int pump_id { get; set; }
        public int hose_id { get; set; }
        public int grade_id { get; set; }
        public string tkt_plu_short_desc { get; set; }
        public double volume { get; set; }
        public double money { get; set; }
        public string end_date_time { get; set; }
        public int sale_id { get; set; }
    }
}
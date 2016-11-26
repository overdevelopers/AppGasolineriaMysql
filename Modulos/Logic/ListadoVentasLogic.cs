using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Collections;
using Modulos.ViewModel;
using System.Configuration;

namespace Modulos.Logic
{
    public class ListadoVentasLogic
    {
        string connectionString = Conexion.ConexionString;
        public List<ListadoVentasViewModel> listado_ventas(Int32 iPump_Id,Int32 iHose_Id,int numultimas)
        {
            List<ListadoVentasViewModel> ssf_pump_sales_List = new List<ListadoVentasViewModel>();
            string sWhere = "";
            if (iPump_Id > 0)
            {
                sWhere = " and ps.PumpId=" + iPump_Id;
            }
            if (iHose_Id > 0)
            {
                sWhere = sWhere + " and ps.NozzleId=" + iHose_Id;
            }
            StringBuilder consulta = new StringBuilder();
            consulta.Append("select");
            consulta.Append(" ps.Id as 'sale_id',");
            consulta.Append(" ps.PumpId as 'pump_id',");
            consulta.Append(" ps.NozzleId as 'hose_id',");
            consulta.Append(" t.Id as 'grade_id',");
            consulta.Append(" p.Name as 'tkt_plu_short_desc',");
            consulta.Append(" ps.Volume as 'volume',");
            consulta.Append(" ps.Money as 'Money',");
            consulta.Append(" ps.EndDate as 'end_date_time'");
            consulta.Append(" FROM pumpsales ps");
            consulta.Append(" INNER JOIN nozzles n ON ps.NozzleId= n.Id");
            consulta.Append(" INNER JOIN tanks t ON n.TankId= t.Id");
            consulta.Append(" INNER JOIN products p ON t.ProductId= p.Id");
            consulta.Append(" "+sWhere);
            consulta.Append(" ORDER BY ps.StartDate DESC LIMIT " + numultimas);

            using(MySqlConnection con=new MySqlConnection(connectionString))
            {
                using(MySqlCommand command=new MySqlCommand(consulta.ToString(), con))
                {
                    con.Open();
                    MySqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        ListadoVentasViewModel pump_sales = new ListadoVentasViewModel
                        {
                            pump_id = Convert.ToInt32(dr["pump_id"]),
                            hose_id = Convert.ToInt32(dr["hose_id"]),
                            grade_id = Convert.ToInt32(dr["grade_id"]),
                            tkt_plu_short_desc = dr["tkt_plu_short_desc"].ToString(),
                            volume = Convert.ToDouble(dr["volume"]),
                            money = Convert.ToDouble(dr["money"]),
                            end_date_time = dr["end_date_time"].ToString(),
                            sale_id = Convert.ToInt32(dr["sale_id"])
                        };
                        ssf_pump_sales_List.Add(pump_sales);
                    }
                }
            }
            return ssf_pump_sales_List;
        }
        public DataSet dsDetalleVenta(int id_venta)
        {
            DataSet data = new DataSet();
            StringBuilder consulta = new StringBuilder();
            consulta.Append("select");
            consulta.Append(" ps.Id as 'sale_id',");
            consulta.Append(" ps.PumpId as 'pump_id',");
            consulta.Append(" ps.NozzleId as 'hose_id',");
            consulta.Append(" t.Id as 'grade_id',");
            consulta.Append(" p.Name as 'tkt_plu_short_desc',");
            consulta.Append(" ps.Volume as 'volume',");
            consulta.Append(" ps.Money as 'Money',");
            consulta.Append(" ps.EndDate as 'end_date_time'");
            consulta.Append(" FROM pumpsales ps");
            consulta.Append(" INNER JOIN nozzles n ON ps.NozzleId= n.Id");
            consulta.Append(" INNER JOIN tanks t ON n.TankId= t.Id");
            consulta.Append(" INNER JOIN products p ON t.ProductId= p.Id");
            consulta.Append(" WHERE ps.Id=@id_venta");


            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                using (MySqlCommand command = new MySqlCommand(consulta.ToString(), con))
                {
                    con.Open();
                    command.Parameters.AddWithValue("@id_venta", id_venta);
                    command.ExecuteNonQuery();
                    using (MySqlDataAdapter adapter = new MySqlDataAdapter(command))
                    {
                        adapter.Fill(data, "tblDetalleVenta");
                    }

                }
            }
            return data;
        }

        public string ImprimirVenta(int id_venta)
        {
            string rpta = "";
            try
            {
                DataSet data = dsDetalleVenta(id_venta);
                if (data.Tables["tblDetalleVenta"].Rows.Count > 0)
                {
                    Reportes.crpDetalleVenta cryRpt = new Reportes.crpDetalleVenta();
                    cryRpt.SetDataSource(data);
                    /*
                    string nombre_empresa= ConfigurationManager.AppSettings["Nombre_Empresa"].ToString();
                    string rnc_empresa=ConfigurationManager.AppSettings["RNC_Empresa"].ToString();
                    string direccion_empresa= ConfigurationManager.AppSettings["Direccion_Empresa"].ToString();
                    string telefono_empresa = ConfigurationManager.AppSettings["Telefono_Empresa"].ToString();
                    string saludo_empresa = ConfigurationManager.AppSettings["Saludo_Empresa"].ToString();
                    */
                    ///cryRpt.SetParameterValue("tkt_cust_name", nombre_empresa);
                    //cryRpt.SetParameterValue("rnc_empresa", rnc_empresa);
                    ///cryRpt.SetParameterValue("txt_cust_address", direccion_empresa);
                    //cryRpt.SetParameterValue("telefono_empresa", telefono_empresa);
                    ///cryRpt.SetParameterValue("tkt_cust_mensaje", saludo_empresa);
                    cryRpt.PrintToPrinter(1, false, 0, 0);
                    rpta = "SI";
                }
                else
                {
                    rpta = "NO";
                }
            }
            catch (Exception ex)
            {
                rpta = ex.ToString();
            }
            return rpta;
        }


    }
}
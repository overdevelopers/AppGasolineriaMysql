$(document).on('ready', function () {
    $("#txtCliente").prop('disabled', true);
    detalle = function (id_venta, lado, manguera, gasolina, volumen, monto, fecha_hora) {
        //CARGO LOS DATOS A LAS VARIABLES GENERALES

        $('#VentaSeleccionada').val(id_venta);
        $("#ladoSeleccionado").val(lado);
        $("#mangueraSeleccionado").val(manguera);
        $("#combustibleSeleccionado").val(gasolina);
        $("#volumenSeleccionado").val(volumen);
        $("#montoSeleccionado").val(monto);
        $("#fecha_horaSeleccionado").val(fecha_hora);        



        //Cargo los datos AL MODAL
        $('#mdlTipoTicket_Lado').html(lado);
        $('#mdlTipoTicket_Manguera').html(manguera);
        $('#mdlTipoTicket_Gasolina').html(gasolina);
        $('#mdlTipoTicket_Volumen').html(volumen);
        $('#mdlTipoTicket_Monto').html(monto);

        //Abro el modal TipoTicket
        $('#modalTipoTicket').modal({ backdrop: 'static', keyboard: false });
    };
    cerrarTodosModal = function () {
        $('#modalTipoTicket,#modalTipoPago,#modalTipoComprobante,#modalRncTarjeta,#modalRncEmpresa,#modalImprimir').modal('hide');
        menu_actual = "NINGUNO";
    };
    //Cuando se cierre cualquier MODAL cambio el estado a menu_actual=NINGUNO
    $('#modalTipoTicket,#modalTipoPago,#modalTipoComprobante,#modalRncTarjeta,#modalRncEmpresa,#modalImprimir').on('hidden.bs.modal', function () {
        menu_actual = "NINGUNO";
        $('#txtCliente,#txtRnc').val('');
        $('#txtClienteT,#txtRncT,#txtTarjeta,#txtPlaca').val('');
    });
    $('#modalTipoTicket').on('shown.bs.modal', function () {
        menu_actual = "TIPO_TICKET";
    });
    $('#modalTipoPago').on('shown.bs.modal', function () {
        menu_actual = "TIPO_PAGO";
    });
    $('#modalTipoComprobante').on('shown.bs.modal', function () {
        menu_actual = "TIPO_COMPROBANTE";
    });
    $('#modalRncTarjeta').on('shown.bs.modal', function () {
        menu_actual = "RNC_TARJETA";
    });
    $('#modalRncEmpresa').on('shown.bs.modal', function () {
        menu_actual = "RNC_EMPRESA";
    });
    $('#modalImprimir').on('shown.bs.modal', function () {
        menu_actual = "IMPRIMIR";
    });


    $('#btnCargarDatos').on('click', function () {
        var surtidor = 0,
            manguera = 1,
            ultimas = 10;
        if ($('#txtSurtidor').val() != "") {
            surtidor = $('#txtSurtidor').val();
        }
        if ($('#txtManguera').val() != "") {
            manguera = $('#txtManguera').val();
        }
        if ($('#txtUltimasVentas').val() != "") {
            ultimas = $('#txtUltimasVentas').val();
        }
        Show(surtidor, manguera, ultimas);
    });
    Show = function (surtidor, manguera, ultimas) {
        $.ajax({
            type: 'POST',
            url: '/Ventas/Listado_Ventas',
            data:
            {
                'surtidor': surtidor,
                'manguera': manguera,
                'ultimas': ultimas
            }
        }).done(function (answer) {
            var answer = JSON.parse(answer);
            var DATA = [];
            for (var i = 0; i < answer.length; i++) {
                var fila = {};
                fila[0] = i;
                fila[1] = answer[i].pump_id;
                fila[2] = answer[i].hose_id;
                fila[3] = answer[i].tkt_plu_short_desc;
                fila[4] = answer[i].volume;
                fila[5] = answer[i].money;
                fila[6] = answer[i].end_date_time;
                var detalle = "<a id='botonDetalle" + i + "' class='btn btn-warning' onclick='detalle(" + answer[i].sale_id + "," + answer[i].pump_id + ",`" + answer[i].hose_id + "`,`" + answer[i].tkt_plu_short_desc + "`,`" + answer[i].volume + "`,`" + answer[i].money + "`,`" + answer[i].end_date_time + "`)'><i class='fa fa-pencil-square-o' aria-hidden='true'> Ver Detalle</i></a>";
                fila[7] = detalle;
                DATA.push(fila);
            }
            var oTable = $('#tblVentas').dataTable();
            oTable.fnClearTable();
            if (DATA.length > 0) {
                oTable.fnAddData(DATA);
                oTable.fnDraw();
            } else {
                oTable.fnDraw();
            }
        });
    };
    $('#tblVentas_filter label input').focusout(function () {
        keyboard = true;
    });
    $('#tblVentas_filter label input').focus(function () {
        keyboard = false;
    });
    $('#txtSurtidor,#txtManguera,#txtUltimasVentas,#txtRnc,#txtRncT,#txtTarjeta,#txtPlaca').focusout(function () {
        keyboard = true;
    });
    $('#txtSurtidor,#txtManguera,#txtUltimasVentas,#txtRnc,#txtRncT,#txtTarjeta,#txtPlaca').focus(function () {
        keyboard = false;
    });

    var keyboard = true;

    imprimirVenta = function () {
        var idVenta = $('#VentaSeleccionada').val();
        if (idVenta != "") {
            $.ajax({
                type: 'POST',
                url: '/AppGasolineria/Ventas/ImprimirVenta',
                data: { 'id_venta': idVenta }
            }).done(function (respuesta) {
                if (respuesta == "SI") {
                    cerrarTodosModal();
                } else if (respuesta == "NO") {
                    sweetAlert("Fallo al Imprimir", "No se pudo imprimir la venta.", "error");
                } else {
                    sweetAlert("Error detectado", respuesta, "error");
                }
            });
        } else {
            sweetAlert("Venta no válida", "El número de venta no es válido", "error");
        }
    }
    generarNcf = function () {
        cerrarTodosModal();
        //Abro el modal TipoComprobante
        $('#modalTipoComprobante').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
    };
    salirTipoComprobante = function () {
        cerrarTodosModal();
    };

    salirTipoTicket = function () {
        $('#modalTipoTicket').modal('hide');
    };


    //Facturas que Generan Credito y Sustentan Costos y/o Gastos
    abrirTipoPago = function (tipoPago) {
        $('#TipoPagoSeleccionado').val(tipoPago);
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalTipoPago').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalTipoPago').modal({ backdrop: 'static', keyboard: false });            
        }, 500);
    };

    volverATipoPago = function () {
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalTipoPago').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalTipoPago').modal({ backdrop: 'static', keyboard: false });
        }, 500);
    };
    volverATipoComprobante = function () {
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalTipoComprobante').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalTipoComprobante').modal({ backdrop: 'static', keyboard: false });
        }, 500);
    };
    volverATipoTicket = function () {
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalTipoTicket').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalTipoTicket').modal({ backdrop: 'static', keyboard: false });
        }, 500);

    };


    Show(0, 1, 10);
    var menu_actual = "NINGUNO";
    $(document).keyup(function (e) {
        if (menu_actual == "NINGUNO" &&
            e.keyCode >= 96 && e.keyCode <= 105
            && keyboard == true) {

            switch (e.keyCode) {
                //0
                case 96:
                    $('#botonDetalle0').click();
                    break;
                    //1
                case 97:
                    $('#botonDetalle1').click();
                    break;
                    //2
                case 98:
                    $('#botonDetalle2').click();
                    break;
                    //3
                case 99:
                    $('#botonDetalle3').click();
                    break;
                    //4
                case 100:
                    $('#botonDetalle4').click();
                    break;
                    //5
                case 101:
                    $('#botonDetalle5').click();
                    break;
                    //6
                case 102:
                    $('#botonDetalle6').click();
                    break;
                    //7
                case 103:
                    $('#botonDetalle7').click();
                    break;
                    //8
                case 104:
                    $('#botonDetalle8').click();
                    break;
                    //9
                case 105:
                    $('#botonDetalle9').click();
                    break;
            }
        } else if (menu_actual == "TIPO_TICKET" &&
            e.keyCode >= 96 && e.keyCode <= 98 && keyboard == true) {
            switch (e.keyCode) {
                //0
                case 96:
                    salirTipoTicket();
                    break;
                    //1
                case 97:
                    imprimirVenta();
                    break;
                    //2
                case 98:
                    generarNcf();
                    break;
            }
        } else if (menu_actual == "TIPO_COMPROBANTE" &&
            ((e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8)
            && keyboard == true) {
            switch (e.keyCode) {
                //0
                case 96:
                    //SALIR
                    salirTipoComprobante();
                    break;
                case 8:
                    //Retroceder
                    volverATipoTicket();
                    break;
                    //1
                case 97:
                    //01 Facturas que Generan Crédito y Sustentan Costos y/o Gastos
                    abrirTipoPago("01 Facturas que Generan Crédito");
                    break;
                    //2
                case 98:
                    //02 Facturas para Consumidores Finales
                    abrirTipoPago("02 Facturas para Consumidores Finales");
                    break;
                    //3
                case 99:
                    //03 Nota de Débito
                    abrirTipoPago("03 Nota de Débito");
                    break;
                    //4
                case 100:
                    //04 Nota de Crédito
                    abrirTipoPago("04 Nota de Crédito");
                    break;
                    //5
                case 101:
                    //11 Proveedores Informales
                    break;
                    //6
                case 102:
                    //12 Registro Único de Ingresos
                    abrirTipoPago("12 Registro Único de Ingresos");
                    break;
                    //7
                case 103:
                    //13 Gastos Menores
                    abrirTipoPago("13 Gastos Menores");
                    break;
                    //8
                case 104:
                    //14 Regímenes Especiales de Tributación
                    abrirTipoPago("14 Regímenes Especiales de Tributación");
                    break;
                    //9
                case 105:
                    //15 Comprobantes Gubernamentales
                    abrirTipoPago("15 Comprobantes Gubernamentales");
                    break;
            }
        } else if (menu_actual == "TIPO_PAGO" &&
                    keyboard == true &&
                   e.keyCode >= 96 && e.keyCode <= 99) {
            switch (e.keyCode) {
                //0 CERRAR TODO
                case 96:
                    cerrarTodosModal();
                    break;
                    //1 EFECTIVO
                case 97:
                    pagarEfectivo();
                    break;
                    //2 TARJETA
                case 98:
                    pagarTarjeta();
                    break;
                    //3 Retroceder a tipo comprobante
                case 99:
                    volverATipoComprobante();
                    break;
            }
        } else if (menu_actual == "IMPRIMIR" &&
                    keyboard == true &&
                    e.keyCode >= 97 && e.keyCode <= 99) {
            switch (e.keyCode) {
                //1
                case 97:
                    //Imprimir
                    Impresion();
                    break;
                    //2
                case 98:
                    //Retroceder a tipocomprobante
                    volverATipoComprobante();
                    break;
                    //3 Cancelar
                case 99:
                    cerrarTodosModal();
                    break;
            }
        } else if (menu_actual == "RNC_TARJETA" &&
                    keyboard == true && (e.keyCode == 106 || e.keyCode == 109)) {
            switch (e.keyCode) {
                //1
                case 106:
                    volverATipoPago();
                    break;
                    //2
                case 109:
                    cerrarTodosModal();

                    break;

            }
        } else if (menu_actual == "RNC_EMPRESA" &&
                    keyboard == true && (e.keyCode == 106 || e.keyCode == 109)) {
            switch (e.keyCode) {
                //1
                case 106:
                    volverATipoPago();
                    break;
                    //2
                case 109:
                    cerrarTodosModal();

                    break;

            }
        }

    });
    pagarEfectivo = function () {
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalRncEmpresa').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalRncEmpresa').modal({ backdrop: 'static', keyboard: false });
            $('#txtRnc').focus();
            $('#formaPagoSeleccionado').val('1');
        }, 500);
    };
    pagarTarjeta = function () {
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalRncTarjeta').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalRncTarjeta').modal({ backdrop: 'static', keyboard: false });
            $('#txtRncT').focus();
            $('#formaPagoSeleccionado').val('2');
        }, 500);
    };
    Impresion = function () {
        //Valores seleccionados automaticamente
        var lado = $("#ladoSeleccionado").val();
        var manguera = $("#mangueraSeleccionado").val();
        var combustible = $("#combustibleSeleccionado").val();
        var volumen = $("#volumenSeleccionado").val();
        var monto = $("#montoSeleccionado").val();
        var fecha_hora = $("#fecha_horaSeleccionado").val();
       

        //Valores obtenido segun el usuario llene
        var tipoComprobante = $('#TipoPagoSeleccionado').val();
        var forma_pago = $('#formaPagoSeleccionado').val();
        var cliente = $('#txtClienteSeleccionado').val();
        var rnc = $("#rncSeleccionado").val();


        var Placa = "";
        var NumeroTarjeta = "";
        if ($('#PlacaSeleccionado').val() != "") {
            Placa = $('#PlacaSeleccionado').val();
        }
        if ($("#NumeroTarjetaSeleccionado").val() != "") {
            NumeroTarjeta = $("#NumeroTarjetaSeleccionado").val();
        }
        $.ajax({
            type: 'POST',
            url: '/Ventas/Impresion',
            data:
                {
                    'tipo_comprobante': tipoComprobante,
                    'forma_pago': forma_pago,
                    'cliente': cliente,
                    'rnc': rnc,
                    'lado': lado,
                    'manguera': manguera,
                    'combustible': combustible,
                    'volumen': volumen,
                    'monto': monto,
                    'fecha': fecha_hora,
                    'Placa': Placa,
                    'NumeroTarjeta': NumeroTarjeta
                },
            beforeSend: function () {
                console.log("Enviando");
            }
        }).done(function (respuesta) {
            console.log(respuesta);
            $('#txtRespuesta').val(respuesta);

            var answer = $('#txtRespuesta').val();
            if (answer == "Correcto") {
                cerrarTodosModal();
                swal("Éxito", "Comprobante guardado!", "success");
            } else if (answer == "NCF_INVALID") {
                sweetAlert("NCF Inválido", "El número de comprobante fiscal generado no es válido.", "error");
            } else if (answer == "Not_Save") {
                sweetAlert("Fallo al Guardar", "El comprobante no fue guardado.", "error");
            } else if (answer == "Not_Increment") {
                sweetAlert("Fallo al generar consecutivo", "El consecutivo no fue generado.", "error");
            } else if (answer == "Not_Save_Not_Increment") {
                sweetAlert("Fallo al guardar y al  generar consecutivo", "El consecutivo no fue generado ni el Comprobante fue guardado.", "error");
            } else if (answer == "NCF_Not_19") {
                sweetAlert("NCF Inválido", "La longitud del ncf generado no es la correcta.", "error");
            } else {
                sweetAlert("Error detectado", answer, "error");
            }
        });


    };
    $('#form_rncEmpresa').on('submit', function (e) {
        e.preventDefault();
        if ($('#txtCliente').val() != "" && $('#txtRnc').val() != "") {
            imprimir($('#txtCliente').val(), $('#txtRnc').val(), "", "");
        } else {
            if ($('#txtRnc').val() == "") {
                sweetAlert("Campo Vacio", "Debe introducir el RNC", "error");
            } else {
                $.ajax({
                    type: 'GET',
                    url: '/Ventas/ComprobarRnc?rnc=' + $('#txtRnc').val()
                }).done(function (respuesta) {
                    if (respuesta != "NO") {
                        $('#txtCliente').val(respuesta);
                    } else {
                        sweetAlert("AVISO", "El RNC no existe en la base de datos, Por favor dirigase a la oficina para que sea agregado", "error");
                        $('#txtCliente,#txtRnc').val('');
                    }
                });
            }
        }
    });

    $('#form_rncTarjeta').on('submit', function (e) {
        e.preventDefault();
        if ($('#txtClienteT').val() != "" && $('#txtRncT').val() != "") {
            imprimir($('#txtClienteT').val(), $('#txtRncT').val(), $('#txtTarjeta').val(), $('#txtPlaca').val())
        } else {
            if ($('#txtRncT').val() == "") {
                sweetAlert("Campo Vacio", "Debe introducir el RNC", "error");
            } else {
                $.ajax({
                    type: 'GET',
                    url: '/Ventas/ComprobarRnc?rnc=' + $('#txtRncT').val()
                }).done(function (respuesta) {
                    if (respuesta != "NO") {
                        $('#txtClienteT').val(respuesta);
                        $('#txtTarjeta').focus();
                    } else {
                        sweetAlert("AVISO", "El RNC no existe en la base de datos, Por favor dirigase a la oficina para que sea agregado", "error");
                        $('#txtClienteT,#txtRncT').val('');
                    }
                });
            }


        }
    });
    imprimir = function (cliente, rnc, tarjeta, placa) {
        $('#txtClienteSeleccionado').val(cliente);
        $('#rncSeleccionado').val(rnc);
        $('#NumeroTarjetaSeleccionado').val(tarjeta);
        $('#PlacaSeleccionado').val(placa);
        cerrarTodosModal();
        setTimeout(function () {
            $('#modalImprimir').removeData('bs.modal').modal({ backdrop: 'static', keyboard: false });
            //$('#modalImprimir').modal({ backdrop: 'static', keyboard: false });
        }, 500);
    };

    setInterval(function () { console.log("MENU ACTUAL: " + menu_actual); }, 3000);
});
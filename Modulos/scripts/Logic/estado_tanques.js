$(document).on('ready', function () {

    cargarDetalles = function (surtidor, manguera, ultimas) {
        $.ajax({
            type: 'GET',
            url: '/EstadoTanques/Listar',
        }).done(function (answer) {
            var answer = JSON.parse(answer);
            var DATA = "";
            for (var i = 0; i < answer.length; i++) {
                var id = answer[i].Id;
                var combustible = answer[i].Combustible;
                var capacidad = answer[i].Capacidad;
                var actual = answer[i].Actual;                
                var lleno = answer[i].Lleno;                
                var capGalones = answer[i].Capacidad;                

                var molde = "<div class='tanque'>";
                molde += "<div class='table-responsive col-md-6'>";
                molde += "<table class='table table-bordered hidden' id='tabla" + id + "'>";

                molde += "<tr>";
                molde += "<th class='text-center'>";
                molde += "Combustible";
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += combustible;
                molde += "</td>";
                molde += "</tr>";

                molde += "<tr>";
                molde += "<th class='text-center'>";
                molde += capGalones;
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += "Lleno: " + lleno + "%";
                molde += "</td>";
                molde += "</tr>";

                molde += "<tr>";
                molde += "<th class='text-center'>";
                molde += "Volumen Actual";
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += actual;
                molde += "</td>";
                molde += "</tr>";


                molde += "<tr>";
                molde += "<th class='text-center' id='thVolume" + id + "'>";
                molde += "Tanque <input id='txtVol" + id + "' type='number' class='form-control' />";
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += "<button onclick='add_Volume(" + id + ")' class='btn btn-success'>Add. vol</button>";
                molde += "</td>";
                molde += "</tr>";

                molde += "<tr>";
                molde += "<th class='text-center' id='thVerificar" + id + "'>";
                molde += "Vol. Tanque <input type='number' id='txtVerificar" + id + "' class='form-control' />";
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += "<button onclick='verificar_Volume(`" + id + "`,`" + actual + "`)' class='btn btn-success'>Verificar</button>";
                molde += "</td>";
                molde += "</tr>";

                molde += "<tr>";
                molde += "<th class='text-center'>";
                molde += "Diferencia";
                molde += "</th>";
                molde += "<td class='text-center'>";
                molde += "<input id='txtDiferencia" + id + "' type='number' class='form-control Diferencia' />";
                molde += "</td>";
                molde += "</tr>";

                molde += "<tr>";
                molde += "<td class='text-center' colspan='2'>";
                molde += "<button onclick='ver_grafico(" + id + ")' class='btn btn-warning'>Gráfico</button>";
                molde += "</td>";
                molde += "</tr>";


                molde += "</table>";
                molde += "<button id='botonDetalle" + id + "' onclick='ver_detalles(" + id + ")' class='btn btn-primary'>Detalles</button>";
                molde += "<div id='grafico" + id + "' style='height: 400px'></div>";

                molde += "</div>";
                molde += "</div>";


                DATA += molde;

            }
            $('#ContenedorData').html(DATA);
            $(".Diferencia").prop('disabled', true);
            for (var i = 0; i < answer.length; i++) {
                var id = answer[i].Id;
                var combustible = answer[i].Combustible;
                var graficoId = "grafico" + id;
                var color = answer[i].Color;
                Highcharts.chart(graficoId, GetOptiones(combustible, 100 - answer[i].Lleno, answer[i].Lleno, color));
            }


        });
    };
    verificar_Volume = function (id_tanque, volumen_actual) {
        var verificar = $('#txtVerificar' + id_tanque).val();
        if (verificar != "") {
            $('#thVerificar' + id_tanque).removeClass('has-error');
            var valor = 0, vol_act = 0, vol_manual = 0;

            vol_act = parseFloat(volumen_actual);
            vol_manual = parseFloat(verificar);
            valor = Math.round(vol_act - vol_manual);
            $('#txtDiferencia' + id_tanque).val(valor);

        } else {
            $('#thVerificar' + id_tanque).addClass('has-error');
        }
    };
    add_Volume = function (id_tanque) {
        var volumen = $('#txtVol' + id_tanque).val();
        if (volumen != "") {
            $('#thVolume' + id_tanque).removeClass('has-error');
            $.ajax({
                type: 'POST',
                url: '/AppGasolineria/EstadoTanques/AddVolume',
                data:
                    {
                        'volumen': volumen,
                        'id': id_tanque
                    }
            }).done(function (respuesta) {
                if (respuesta == "SI") {
                    swal("Éxito", "Volumen Actualizado", "success");
                    cargarDetalles();
                } else if (respuesta == "NO") {
                    sweetAlert("Oops...", "No se pudo actualizar el volumen.", "error");
                } else {
                    sweetAlert("Ha ocurrido un error inesperado", respuesta, "error");
                }
            });
        } else {
            $('#thVolume' + id_tanque).addClass('has-error');
        }

    };
    ver_detalles = function (id_grafico) {
        $('#txtVol' + id_grafico).val('');
        $('#txtVerificar' + id_grafico).val('');
        $('#txtDiferencia' + id_grafico).val('');
        $('#thVerificar' + id_grafico).removeClass('has-error');
        $('#thVolume' + id_grafico).removeClass('has-error');
        $('#grafico' + id_grafico).fadeOut();
        $('#tabla' + id_grafico).removeClass('hidden');
        $('#botonDetalle' + id_grafico).addClass('hidden');
    };
    ver_grafico = function (id_grafico) {
        $('#grafico' + id_grafico).fadeIn();
        $('#tabla' + id_grafico).addClass('hidden');
        $('#botonDetalle' + id_grafico).removeClass('hidden');
    };
    cargarDetalles();
    function GetOptiones(texto, vacio, lleno, color) {
        var opciones = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            colors: ['#F0F0F0', color],
            title: {
                text: texto
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    borderColor: '#000000',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Capacidad',
                data: [
                    ['Vacío: ' + vacio + '%', vacio],
                    ['Lleno: ' + lleno + '%', lleno],


                ]
            }]
        };
        return opciones;
    }






});
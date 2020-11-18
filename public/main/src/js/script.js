var C = [];
var M = [];
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(pieCharts);

async function showChart() {
    const date = new Date();
    for (i = 15; i >= 0; i--) {
        var aux = 0;
        let tdate = new Date(date.getFullYear(), date.getMonth(), (date.getDate() - i));
        let ndate = formatDate(tdate);
        const response = await fetch(`/api/getCData/${aux}/${ndate}`);
        const data = await response.json();
        M.push({ label: ndate, y: data[0].M });
        aux++;
        const response0 = await fetch(`/api/getCData/${aux}/${ndate}`);
        const data0 = await response0.json();
        C.push({ label: ndate, y: data0[0].C });
    }
    console.log(C)
    console.log(M)
    var chart = new CanvasJS.Chart("chartcontainer", {
        title: {
            text: "Casos de Covid-19"
        },
        axisX: {
            valueFormatString: "####",
            interval: 1
        },
        axisY: { title: "Número de Casos" },
        data: [{
            type: "column",
            showInLegend: true,
            name: "Casos Registrados",
            xValueFormatString: "####",
            dataPoints: C
        }, {
            type: "column",
            showInLegend: true,
            name: "Casos de Muertes",
            xValueFormatString: "####",
            dataPoints: M
        }]
    });
    chart.render();
}

async function pieCharts() {
    var aux = 2;
    m = 0;
    c = 0;
    ec = 0;
    eh = 0;
    eu = 0;
    const response = await fetch(`/api/getCData/${aux}/0`);
    const data = await response.json();
    data.forEach(id_i => {
        if (id_i.idstate == 0) {
            ec = ec + id_i.C;
        }
        if (id_i.idstate == 1) {
            eh = eh + id_i.C;
        }
        if (id_i.idstate == 2) {
            eu = eu + id_i.C;
        }
        if (id_i.idstate == 3) {
            c = c + id_i.C;
        }
        if (id_i.idstate == 4) {
            m = m + id_i.C;
        }
    });
    var cdata = google.visualization.arrayToDataTable([
        ['Estado', 'Numero de Casos'],
        ['Infectados', (ec + eh + eu)],
        ['Muertos', m],
        ['Curados', c]
    ]);
    var options = { title: 'Casos Totales', width: 300, height: 300, chartArea: { left: '10%', top: 0, width: '100%', height: '100%' } };
    var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
    chart.draw(cdata, options);
    var cdata = google.visualization.arrayToDataTable([
        ['Estado', 'Numero de Casos'],
        ['En Tratamiento en Casa', ec],
        ['En Tratamiento en Hospital', eh],
        ['En Tratamiento en UCI', eu],
        ['Muertos', m]
    ]);
    var options = { title: 'Infectados', width: 300, height: 300, chartArea: { left: '10%', top: 0, width: '100%', height: '100%' } };
    var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
    chart.draw(cdata, options);
    aux = 3;
    var pos = 0;
    var neg = 0;
    const response0 = await fetch(`/api/getCData/${aux}/0`);
    const data0 = await response0.json();
    data0.forEach(id_i => {
        if (id_i.test_result == 0) {
            neg = id_i.C;
        }
        if (id_i.test_result == 1) {
            pos = id_i.C;
        }
    });
    var cdata = google.visualization.arrayToDataTable([
        ['Estado', 'Numero de Casos'],
        ['Positivos', pos],
        ['Negativos', neg]
    ]);
    var options = { title: 'Resultados', width: 300, height: 300, chartArea: { left: '10%', top: 0, width: '100%', height: '100%' } };
    var chart = new google.visualization.PieChart(document.getElementById('piechart3'));
    chart.draw(cdata, options);
}

function formatDate(date) {
    const ndate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return ndate;
}

showChart();
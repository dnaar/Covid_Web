const id_search = document.getElementById("id_search");
const cc_search = document.getElementById("cc_search");
const id = document.getElementById("id");
const cc = document.getElementById("cc");
var search_id, search_cc = "";
var patRes = [];
var act_case;
var marker_i=''
var marker_1=''
var x=1
function idchecked() {
    id.disabled = !id_search.checked;
    if (!id_search.checked) { id.value = ""; }
}

function ccchecked() {
    cc.disabled = !cc_search.checked;
    if (!cc_search.checked) { cc.value = ""; }
}

async function search_cases() {
    var scheck1 = true;
    var scheck3 = true;
    if (id_search.checked) {
        if (id.value.length == 0) {
            id.style.boxShadow = "0px 0px 10px red";
            scheck1 = false;
        } else {
            scheck1 = true;
            id.style.boxShadow = "";
        }
    }
    if (cc_search.checked) {
        if (cc.value.length == 0) {
            cc.style.boxShadow = "0px 0px 10px red";
            scheck3 = false;
        } else {
            scheck3 = true;
            cc.style.boxShadow = "";
        }
    }
    if (!(id_search.checked || cc_search.checked)) { return; };
    if (!(scheck1 && scheck3)) { console.log(scheck1, scheck3); return; }
    search_id = id.value;
    search_cc = cc.value;
    if (id.value == "") {
        search_id = 0;
    }
    if (cc.value == "") {
        search_cc = 0;
    }
    patRes = [];
    document.getElementById("patientRes").innerHTML = '<tr>    <th>ID. Caso</th>    <th>Nombre</th>    <th>Apellido</th>    <th>Cédula</th>    <th>Sexo</th>    <th>Fecha de Nacimiento</th>    <th>Resultado</th>    <th>Fecha de exámen</th></tr>';
    document.getElementById("patState").innerHTML = '';
    const response = await fetch(`/medic/search/filter/${search_id}/${search_cc}`);
    const data = await response.json();
    if (data.length == 0) {
        alert("No se ha encontrado identificación")
    } else {
        scheck3 = true;
        cc.style.boxShadow = "";
    }
    var pos_cases = [];
    data.forEach((patient, index) => {
        
            newLatLng = patient.res_address.split(',');
            newLatLng = { lat: parseFloat(newLatLng[0]), lng: parseFloat(newLatLng[1]) };
            const Icon_i = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
            });
            const Icon_1 = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
                shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
            });
         
        if (x==0){
            map.removeLayer(marker_i)
            map.removeLayer(marker_1)
            x=1
        }
        x=0
        marker_i = L.marker(newLatLng, { icon: Icon_i, interactive: false }).addTo(map); 
        newLatLng = patient.job_address.split(',');
        newLatLng = { lat: parseFloat(newLatLng[0]), lng: parseFloat(newLatLng[1]) };
        
        marker_1 = L.marker(newLatLng, { icon: Icon_1, interactive: false }).addTo(map);

        var res_i = document.createElement("tr");
        res_i.style.cursor = "pointer";
        res_i.value = index;
        res_i.onclick = () => { pat_indexing(index) };
        res_i.innerHTML = `<td>${patient.casecode}</td> <td>${patient.name}</td> <td>${patient.lname}</td> <td>${patient.idpatient}</td> <td>${getGender(patient.gender)}</td> <td>${formatDate(patient.birthdate)}</td> <td>${getResult(patient.test_result)}</td> <td>${formatDate(patient.test_date)}</td>`;
        document.getElementById("patientRes").appendChild(res_i);
        patRes.push(patient);
    });
};

function getResult(result) {
    if (result == 0) {
        return "Negativo";
    } else {
        return "Positivo";
    }
}

function getGender(gender) {
    if (gender == 0) {
        return "Mujer";
    }
    if (gender == 1) {
        return "Hombre";
    }
    if (gender == 2) {
        return "Otro";
    }
}

function formatDate(date) {
    date = new Date(date);
    date = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
    return date;
}

async function pat_indexing(index) {
    act_case = patRes[index];
    const response = await fetch(`/medic/search/states/${patRes[index].casecode}`);
    const data = await response.json();
    document.getElementById("patState").innerHTML = "<tr><th>Estado</th><th>Fecha de Actualización</th></tr>";
    data.forEach((patient) => {
        var res_i = document.createElement("tr");
        res_i.innerHTML = `<tr> <td>${patient.state}</td> <td>${formatDate(patient.state_date)}</td> </tr>`;
        document.getElementById("patState").appendChild(res_i);
    });
}	
var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
osm = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: osmAttrib
});

var map = L.map('map').setView([4.570868, -74.297333], 4).addLayer(osm);

function clsession() {
    document.forms["log_out"].submit();
}
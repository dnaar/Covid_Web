var map;

function initializeMap() {
    map = L.map('map', { zoomControl: false }).setView([4.570868, -74.297333], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap Contributors </a>',
        maxZoom: 18,
        minZoom: 4
    }).addTo(map);
    loadCases();
}
async function loadCases() {
    const response = await fetch('/medic/resume/loadcases');
    const data = await response.json();
    var pos_cases = [];
    data.forEach(obj => {
        if (obj.test_result == 1) {
            pos_cases.push(obj.casecode);
        } else {
            newLatLng = obj.res_address.split(',');
            newLatLng = { lat: parseFloat(newLatLng[0]), lng: parseFloat(newLatLng[1]) };
            const Icon_i = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
            });
            const marker_i = L.marker(newLatLng, { icon: Icon_i, interactive: false }).addTo(map);
        }
    });
    const response1 = await fetch('/medic/resume/loaddata');
    const data1 = await response1.json();
    data1.forEach(case_i => {
        var iconurl = '';
        newLatLng = case_i.res_address.split(',');
        newLatLng = { lat: parseFloat(newLatLng[0]), lng: parseFloat(newLatLng[1]) };
        if (case_i.idstate == 1 || case_i.idstate == 0) {
            iconurl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
        }
        if (case_i.idstate == 2) {
            iconurl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
        }
        if (case_i.idstate == 3) {
            iconurl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
        }
        if (case_i.idstate == 4) {
            iconurl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
        }
        const Icon_i = L.icon({
            iconUrl: iconurl,
            shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
        });
        const marker_i = L.marker(newLatLng, { icon: Icon_i, interactive: false }).addTo(map);
    });
}

initializeMap();
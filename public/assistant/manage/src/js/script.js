const id_search = document.getElementById("id_search");
const name_search = document.getElementById("name_search");
const cc_search = document.getElementById("cc_search");
const id = document.getElementById("id");
const name = document.getElementById("name");
const cc = document.getElementById("cc");
var search_id, search_name, search_cc = "";
var patRes = [];
var act_case;

function idchecked() {
    id.disabled = !id_search.checked;
    if (!id_search.checked) { id.value = ""; }
}

function namechecked() {
    name.disabled = !name_search.checked;
    if (!name_search.checked) { name.value = ""; }
}

function ccchecked() {
    cc.disabled = !cc_search.checked;
    if (!cc_search.checked) { cc.value = ""; }
}

async function search_cases() {
    var scheck1 = true;
    var scheck3 = true;
    var scheck2 = true;
    if (id_search.checked) {
        if (id.value.length == 0) {
            id.style.boxShadow = "0px 0px 10px red";
            scheck1 = false;
        } else {
            scheck1 = true;
            id.style.boxShadow = "";
        }
    }
    if (name_search.checked) {
        if (name.value.length == 0) {
            name.style.boxShadow = "0px 0px 10px red";
            scheck2 = false;
        } else {
            scheck2 = true;
            name.style.boxShadow = "";
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
    if (!(id_search.checked || name_search.checked || cc_search.checked)) { return; };
    if (!(scheck1 && scheck2 && scheck3)) { console.log(scheck1, scheck2, scheck3); return; }
    search_id = id.value;
    search_name = name.value;
    search_cc = cc.value;
    if (id.value == "") {
        search_id = 0;
    }
    if (name.value == "") {
        search_name = 0;
    }
    if (cc.value == "") {
        search_cc = 0;
    }
    patRes = [];
    document.getElementById("patientRes").innerHTML = '';
    document.getElementById("patState").innerHTML = '';
    document.getElementById("stateUpdate").style.display = "none";
    const response = await fetch(`/assistant/manage/filter/${search_id}/${search_name}/${search_cc}`);
    const data = await response.json();
    data.forEach((patient, index) => {
        var con_i = document.createElement("div");
        con_i.style.cursor = "pointer";
        con_i.value = index;
        con_i.onclick = () => { pat_indexing(index) };
        var res_i = document.createElement("table");
        res_i.innerHTML = `<tr> <td>${patient.casecode}</td> <td>${patient.name}</td> <td>${patient.lname}</td> <td>${patient.idpatient}</td> <td>${patient.gender}</td> <td>${patient.birthdate}</td> <td>${patient.test_result}</td> <td>${patient.test_date}</td> </tr>`;
        con_i.appendChild(res_i);

        document.getElementById("patientRes").appendChild(con_i);
        patRes.push(patient);
    });
};

async function pat_indexing(index) {
    act_case = patRes[index];
    const response = await fetch(`/assistant/manage/states/${patRes[index].casecode}`);
    const data = await response.json();
    document.getElementById("patState").innerHTML = "";
    data.forEach((patient) => {
        var con_i = document.createElement("div");
        var res_i = document.createElement("table");
        res_i.innerHTML = `<tr> <td>${patient.state}</td> <td>${patient.state_date}</td> </tr>`;
        con_i.appendChild(res_i);
        document.getElementById("patState").appendChild(con_i);
    });
    document.getElementById("stateUpdate").style.display = "block";
    if (data[data.length - 1].idstate == 4) {
        document.getElementById("update_btn").disabled = true;
    } else {
        document.getElementById("update_btn").disabled = false;
    }
}
async function updateState() {
    const nDate = document.getElementById("up_date").value;
    if (nDate == "") {
        alert("Por favor ingresar la fecha de actualización.");
    } else {
        console.log(`/assistant/manage/u_states/${act_case.casecode}/${document.getElementById("updateState").value}/${nDate}`);
        await fetch(`/assistant/manage/u_states/${act_case.casecode}/${document.getElementById("updateState").value}/${nDate}`);
        console.log("Caso añadido");
        if (document.getElementById("updateState").value == 4) {
            document.getElementById("update_btn").disabled = true;
        }
    }
}

function clsession() {
    document.forms["log_out"].submit();
}
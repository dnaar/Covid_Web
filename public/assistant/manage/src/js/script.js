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
    let prueba = document.getElementById('prueba');
    if (id_search.checked) {
        if (id.value.length == 0) {
            id.style.boxShadow = "0px 0px 10px #209D9D";
            scheck1 = false;
        } else {
            scheck1 = true;
            id.style.boxShadow = "";
            prueba.style.display= "block"
        }
    }else{
        id.style.boxShadow = "";
    }
    if (name_search.checked) {
        if (name.value.length == 0) {
            name.style.boxShadow = "0px 0px 10px #209D9D";
            scheck2 = false;
        } else {
            scheck2 = true;
            name.style.boxShadow = "";
            prueba.style.display= "block"
        }
    }else{
        name.style.boxShadow = "";
    }
    if (cc_search.checked) {
        if (cc.value.length == 0) {
            cc.style.boxShadow = "0px 0px 10px #209D9D";
            scheck3 = false;
        } else {
            scheck3 = true;
            cc.style.boxShadow = "";
            prueba.style.display= "block"
        }
    }else{
        cc.style.boxShadow = "";
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
    document.getElementById("patList").style.display = "block";
    document.getElementById("patientRes").innerHTML = '<tr>    <th>ID. Caso</th>    <th>Nombre</th>    <th>Apellido</th>    <th>Cédula</th>    <th>Sexo</th>    <th>Fecha de Nacimiento</th>    <th>Resultado</th>    <th>Fecha de exámen</th></tr>';
    document.getElementById("patState").innerHTML = '';
    document.getElementById("stateUpdate").style.display = "none";
    const response = await fetch(`/assistant/manage/filter/${search_id}/${search_name}/${search_cc}`);
    const data = await response.json();
    data.forEach((patient, index) => {
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
    const response = await fetch(`/assistant/manage/states/${patRes[index].casecode}`);
    const data = await response.json();
    if (act_case.test_result == 0) {
        alert("El caso seleccionado tiene resultado negativo en su prueba de Covid-19");
    } else {
        document.getElementById("patState").innerHTML = "<tr><th>Estado</th><th>Fecha de Actualización</th></tr>";
        data.forEach((patient) => {
            var res_i = document.createElement("tr");
            res_i.innerHTML = `<tr> <td>${patient.state}</td> <td>${formatDate(patient.state_date)}</td> </tr>`;
            document.getElementById("patState").appendChild(res_i);
        });
        document.getElementById("stateUpdate").style.display = "inline-block";
        if (data[data.length - 1].idstate == 4) {
            document.getElementById("update_btn").disabled = true; 
            document.getElementById("update_btn").style.display="none";      
        } else {
            document.getElementById("update_btn").disabled = false;
            document.getElementById("update_btn").style.display="inline";     
        }
    }

}
async function updateState() {
    const nDate = document.getElementById("up_date").value;
    if (nDate == "") {
        alert("Por favor ingresar la fecha de actualización.");
    } else {
        console.log(`/assistant/manage/u_states/${act_case.casecode}/${document.getElementById("updateState").value}/${nDate}`);
        await fetch(`/assistant/manage/u_states/${act_case.casecode}/${document.getElementById("updateState").value}/${nDate}`);
        alert('Se ha actualizado el estado del caso seleccionado')
        if (document.getElementById("updateState").value == 4) {
            document.getElementById("update_btn").disabled = true;            
        }
    }




}

function clsession() {
    document.forms["log_out"].submit();
}
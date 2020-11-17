function validateForm() {
    var name = document.forms["case_form"]["name"];
    var lname = document.forms["case_form"]["lname"];
    var id = document.forms["case_form"]["id"];
    var gender = document.forms["case_form"]["gender"];
    var bdate = document.forms["case_form"]["bdate"];
    var haddress = document.forms["case_form"]["haddress"];
    var waddress = document.forms["case_form"]["waddress"];
    var tres = document.forms["case_form"]["tres"];
    var tdate = document.forms["case_form"]["tdate"];


    var validate0, validate1, validate2, validate3, validate4, validate5, validate6, validate7, validate8 = false;
    if (name.value == "" || /\d/.test(name.value)) {
        name.style.boxShadow = "0px 0px 10px red";
        validate0 = false;
    } else {
        name.style.boxShadow = "";
        validate0 = true;
    }
    if (lname.value == "" || /\d/.test(lname.value)) {
        lname.style.boxShadow = "0px 0px 10px red";
        validate1 = false;
    } else {
        lname.style.boxShadow = "";
        validate1 = true;
    }
    if (id.value == "") {
        id.style.boxShadow = "0px 0px 10px red";
        validate2 = false;
    } else {
        id.style.boxShadow = "";
        validate2 = true;
    }
    if (gender.value == "") {
        gender.style.boxShadow = "0px 0px 10px red";
        validate3 = false;
    } else {
        gender.style.boxShadow = "";
        validate3 = true;
    }
    if (bdate.value == "") {
        bdate.style.boxShadow = "0px 0px 10px red";
        validate4 = false;
    } else {
        bdate.style.boxShadow = "";
        validate4 = true;
    }
    if (haddress.value == "") {
        haddress.style.boxShadow = "0px 0px 10px red";
        validate5 = false;
    } else {
        haddress.style.boxShadow = "";
        validate5 = true;
    }
    if (waddress.value == "") {
        waddress.style.boxShadow = "0px 0px 10px red";
        validate6 = false;
    } else {
        waddress.style.boxShadow = "";
        validate6 = true;
    }
    if (tres.value == "") {
        tres.style.boxShadow = "0px 0px 10px red";
        validate7 = false;
    } else {
        tres.style.boxShadow = "";
        validate7 = true;
    }
    if (tdate.value == "") {
        tdate.style.boxShadow = "0px 0px 10px red";
        validate8 = false;
    } else {
        tdate.style.boxShadow = "";
        validate8 = true;
    }
    if (validate0 && validate1 && validate2 && validate3 && validate4 && validate5 && validate6 && validate7 && validate8) {
        document.forms["case_form"].submit();
    }

}
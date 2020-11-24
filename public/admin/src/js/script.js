function validateForm() {
    var usr_name = document.forms["user_form"]["usr_name"];
    var usr_lname = document.forms["user_form"]["usr_lname"];
    var usr_id = document.forms["user_form"]["usr_id"];
    var usr_role = document.forms["user_form"]["usr_role"];
    var usr_username = document.forms["user_form"]["usr_username"];
    var usr_password = document.forms["user_form"]["usr_password"];
    var validate0, validate1, validate2, validate3, validate4, validate5 = false;
    if (usr_name.value == "" || /\d/.test(usr_name.value)) {
        usr_name.style.boxShadow = "0px 0px 10px #209D9D";
        validate0 = false;
    } else {
        usr_name.style.boxShadow = "";
        validate0 = true;
    }
    if (usr_lname.value == "" || /\d/.test(usr_lname.value)) {
        usr_lname.style.boxShadow = "0px 0px 10px #209D9D";
        validate1 = false;
    } else {
        usr_lname.style.boxShadow = "";
        validate1 = true;
    }
    if (usr_id.value == "") {
        usr_id.style.boxShadow = "0px 0px 10px #209D9D";
        validate2 = false;
    } else {
        usr_id.style.boxShadow = "";
        validate2 = true;
    }
    if (usr_role.value == "") {
        usr_role.style.boxShadow = "0px 0px 10px #209D9D";
        validate3 = false;
    } else {
        usr_role.style.boxShadow = "";
        validate3 = true;
    }
    if (usr_username.value == "" || usr_username.value.length < 6) {
        usr_username.style.boxShadow = "0px 0px 10px #209D9D";
        $(document.getElementById("displayError3")).fadeIn("fast");
        validate4 = false;
    } else {
        usr_username.style.boxShadow = "";
        $(document.getElementById("displayError3")).fadeOut("fast");
        validate4 = true;
    }
    if (usr_password.value == "" || usr_password.value.length < 8) {
        usr_password.style.boxShadow = "0px 0px 10px #209D9D";
        $(document.getElementById("displayError4")).fadeIn("fast");
        validate5 = false;
    } else {
        usr_password.style.boxShadow = "";
        $(document.getElementById("displayError4")).fadeOut("fast");
        validate5 = true;
    }
    if (validate0 && validate1 && validate2 && validate3 && validate4 && validate5) {
        document.forms["user_form"].submit();
        alert('Usuario registrado')
    }

}

function clsession() {
    document.forms["log_out"].submit();
}
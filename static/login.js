let main = function () {
    let login = true;
    let regValid = [false, false, false, false];
    return () => {
        $(document).ready(() => {
            $("#regName").hide();
            $("#regPwd").hide();

            $("#goto").click(() => {
                loadPage(login);
                clearInput($("#inputEmail"));
                clearInput($("#inputPassword"));
                clearInput($("#inputUsername"));
                clearInput($("#confirmPassword"));
                login = !login;
            });

            $("#inputEmail").on("keyup paste", () => {
                if (login) return;
                let tmp = $("#inputEmail");
                if (tmp.val().indexOf("@") < 1 || tmp.val().indexOf(".") < 0) {
                    checkDisplay(tmp, tmp.next(), "Invalid email address", false, 0);
                    return;
                }
                $.post("/validate", {email: tmp.val()}, (data) => {
                    if (data === "0") checkDisplay(tmp, tmp.next(), "Existing email address", false, 0);
                    return;
                });
                checkDisplay(tmp, tmp.next(), "This email address is valid", true, 0)
            });

            $("#inputPassword").on("keyup paste", () => {
                if (login) return;
                let tmp = $("#inputPassword");
                if (tmp.val().length < 6) {
                    checkDisplay(tmp, tmp.next(), "Password should be at least 6 characters", false, 1);
                    return;
                }
                checkDisplay(tmp, tmp.next(), "This password is valid", true, 1);
            });

            $("#confirmPassword").on("keyup paste", () => {
                if (login) return;
                let tmp = $("#confirmPassword");
                if (tmp.val() !== $("#inputPassword").val()) {
                    checkDisplay(tmp, tmp.next(), "Inconsistent passwords", false, 2);
                    return;
                }
                checkDisplay(tmp, tmp.next(), "Password confirmed", true, 2);
            });

            $("#inputUsername").on("keyup paste", () => {
                if (login) return;
                let tmp = $("#inputUsername");
                if (tmp.val().length <= 0) {
                    checkDisplay(tmp, tmp.next(), "Username is too short", false, 3);
                    return;
                }
                if (!isAlphanum(tmp.val())) {
                    checkDisplay(tmp, tmp.next(), "Username can only contain alphabet and number", false, 3);
                    return;
                }
                $.post("/validate", {username: tmp.val()}, (data) => {
                    if (data === "0") checkDisplay(tmp, tmp.next(), "Existing username", false, 3);
                    return;
                });
                checkDisplay(tmp, tmp.next(), "This username is valid", true, 3)
            });

            $("#inputSubmit").click(() => {
                loginSubmit();
            });
        });

        $(document).keydown((event) => {
            if (event.which === 13) {
                event.preventDefault();
                loginSubmit();
            }
        });

        function loginSubmit() {
            if (!login) {
                checkEmpty($("#inputEmail"), 0);
                checkEmpty($("#inputPassword"), 1);
                checkEmpty($("#confirmPassword"), 2);
                checkEmpty($("#inputUsername"), 3);
                if (allValid(regValid)) {
                    $.post("/register", {
                        email: $("#inputEmail").val(),
                        username: $("#inputUsername").val(),
                        password: $("#inputPassword").val()
                    }, () => {
                        window.location.reload();
                    });
                }
            } else {
                $("#inputEmail").removeClass("is-invalid").next().removeClass("invalid-feedback").text("");
                $.post("/register", {
                    email: $("#inputEmail").val(),
                    password: $("#inputPassword").val()
                }, (data) => {
                    if (data === "0") {
                        checkDisplay($("#inputEmail"), $("#inputEmail").next(), "This account does not exist", false, 0);
                    }
                    else if (data === "00") {
                        checkDisplay($("#inputPassword"), $("#inputPassword").next(), "Incorrect password", false, 1);
                    }
                    else {
                        window.location.reload();
                    }
                })
            }
        }

        function loadPage(state) {
            $("#regName").toggle();
            $("#regPwd").toggle();
            if (state) { // Register
                $("#goto").text("Have account? Login>>>");
                $("#inputSubmit").removeClass("btn-primary")
                    .addClass("btn-success")
                    .text("Create account");
            } else { // Login
                $("#goto").text("New here? Sign up>>>");
                $("#inputSubmit").removeClass("btn-success")
                    .addClass("btn-primary")
                    .text("Log in");
            }
        }

        function checkDisplay(inputDOM, checkDOM, msg, valid, i) {
            if (valid) {
                inputDOM.removeClass("is-invalid");
                inputDOM.addClass("is-valid");
                checkDOM.removeClass("invalid-feedback");
                checkDOM.addClass("valid-feedback");
                regValid[i] = true;
            } else {
                inputDOM.removeClass("is-valid");
                inputDOM.addClass("is-invalid");
                checkDOM.removeClass("valid-feedback");
                checkDOM.addClass("invalid-feedback");
                regValid[i] = false;
            }
            checkDOM.text(msg);
        }

        function checkEmpty(inputDOM, i) {
            if (inputDOM.val().length <= 0) {
                checkDisplay(inputDOM, inputDOM.next(), "This field cannot be empty", false, i);
            }
        }

        function clearInput(inputDOM) {
            inputDOM.removeClass("is-valid is-invalid");
            inputDOM.val("");
            inputDOM.next().removeClass("valid-feedback invalid-feedback");
            inputDOM.next().text("");
            regValid = [false, false, false, false]
        }

        function allValid(array) {
            for (let i = 0; i < array.length; i++) {
                if (!array[i]) return false;
            }
            return true;
        }

        function isAlphanum(s) {
            for (let i = 0; i < s.length; i++) {
                let code = s.charCodeAt(i);
                if (code < 48 || code > 57 && code < 65 || code > 90 && code < 97 || code > 122) {
                    return false;
                }
            }
            return true;
        }
    }
}()();




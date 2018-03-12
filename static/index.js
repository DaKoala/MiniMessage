let me = {};
let interval;

/* Input name before the page load */
$(window).on("load", () => {
    me.name = prompt("Please enter your name:", "");
    Object.freeze(me);
});

$(document).ready(() => {
    /* Login */
    $.post("/login", {name: me.name}, (data) => {
        data = JSON.parse(data);
        $("#greeting").text("Welcome, " + data["name"]);
        let onlineUsers = data["online"];
        for (let i = 0; i < onlineUsers.length; i++) {
            newUser(onlineUsers[i]);
        }
    });

    /* Submit message */
    $("#msgSubmit").click(() => {
        let dataOut = {
            name: me.name,
            message: $("#msgInput").val()
        };
        $("#msgInput").val("");
        $.post("/receiver", dataOut, (data) => {
            polling();
        });
    });

    /* Get message */
    interval = setInterval("polling()", 3000);

    /* Quit */
    $(window).on("unload", () => {
        $.post("/quit", {name: me.name}, () => {

        });
    });
});

/* Handle error */
$(document).ajaxError(() => {
    interval = clearInterval(interval);
});


function polling() {
    $.post("/sender", {name: me.name}, (data) => {
        console.log(data);
        data = JSON.parse(data);

        /* Handle new messages */
        for (let i = 0; i < data.message.length; i++) {
            let curr = data.message[i];
            let newMsg = $("<div></div>");
            let temp = $("<p></p>");
            temp.html("<p>" + curr.name + " " + "<small>" + curr.time + "</small></p>");
            newMsg.append(temp);
            temp = $("<p></p>");
            temp.html(curr.message);
            newMsg.append(temp);
            $("#display").append(newMsg);
        }

        /* Handle user arrival */
        if (data.arrive !== undefined) {
            for (let i = 0; i < data.arrive.length; i++) {
                newUser(data.arrive[i]);
            }
        }

        /* Handle user quit */
        if (data.quit !== undefined) {
            console.log("quit");
            for (let i = 0; i < data.quit.length; i++) {
                $("#" + data.quit[i]).remove();
            }
        }
    });
}

function newUser(name) {
    let temp = $("<li></li>");
    temp.attr("id", name);
    temp.text(name);
    $("#onlineUsers").append(temp);
}

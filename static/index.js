let me = {};
let interval;

$(document).ready(() => {
    /* Login */
    me.name = prompt("Please enter your name:", "");
    Object.freeze(me);
    $.post("/login", {name: me.name}, (data) => {
        data = JSON.parse(data);
        $("#greeting").html($("#greeting").html() + " " + data["name"]);
        let onlineUsers = data["online"];
        for (let i = 0; i < onlineUsers.length; i++) {
            newUser(onlineUsers[i]);
        }
    });

    /* Submit message */
    $("#msgSubmit").click(() => {
        sendMessage();
    });
    $("#msgInput").bind("keypress", (event) => {
        if (event.keyCode === 13 && event.ctrlKey) {
            $("#msgInput").val($("#msgInput").val() + "\n");
        }
        else if (event.keyCode === 13) {
            event.preventDefault();
            sendMessage();
        }
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
            let newMsg = $("<div class='message'></div>");
            if (curr.name === me.name) {
                newMsg.addClass("me");
                curr.name = "Me";
            }
            let temp = $("<p></p>");
            temp.html('<span class="badge badge-secondary">' + curr.name + "</span>" + "<small>" + " " + curr.time + "</small>");
            newMsg.append(temp);
            temp = $('<div class="pop mr-auto"></div>');
            temp.html(curr.message);
            newMsg.append(temp);
            $("#display").append(newMsg);
        }
        $("#display").scrollTop($("#display")[0].scrollHeight);


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
    temp.attr("class", "list-group-item");
    temp.html('<i class="fa fa-check-square" aria-hidden="true"></i>' + " " + name);
    $("#onlineUsers").append(temp);
}

function sendMessage() {
    if ($("#msgInput").val() === "") return;
    let dataOut = {
        name: me.name,
        message: $("#msgInput").val()
    };
    $("#msgInput").val("");
    $.post("/receiver", dataOut, (data) => {
        polling();
    });
}
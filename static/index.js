let me = {};
let interval;

$(document).ready(() => {
    /* Login */
    let name = prompt("Please enter your name:", "");
    me.name = name;
    me = Object.freeze(me);
    $.post("/login", {name: name}, (data) => {
        data = JSON.parse(data);
        $("#greeting").text("Welcome, " + data["name"]);
        let onlineUsers = data["online"];
        for (let i = 0; i < onlineUsers.length; i++) {
            let temp = $("<li></li>");
            temp.attr("id", onlineUsers[i]);
            temp.text(onlineUsers[i]);
            $("#onlineUsers").append(temp);
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
    $(window).unload(() => {
        $.post("/quit", {name: me.name}, () => {

        });
    });
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

        /* Handle user quit */
        if (data.quit !== undefined) {
            console.log("quit");
            for (let i = 0; i < data.quit.length; i++) {
                $("#" + data.quit[i]).remove();
            }
        }
    })
        .error(() => {
            interval = clearInterval(interval);
        })
}



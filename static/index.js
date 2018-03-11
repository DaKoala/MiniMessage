let me = {};

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
    setInterval("polling()", 3000);
});


function polling() {
    $.post("/sender", {name: me.name}, (data) => {
        let messages = JSON.parse(data).message;
        for (let i = 0; i < messages.length; i++) {
            let curr = messages[i];
            let newMsg = $("<div></div>");
            let temp = $("<p></p>");
            temp.html("<p>" + curr.name + " " + "<small>" + curr.time + "</small></p>");
            newMsg.append(temp);
            temp = $("<p></p>");
            temp.html(curr.message);
            newMsg.append(temp);
            $("#display").append(newMsg);
        }
    });
}



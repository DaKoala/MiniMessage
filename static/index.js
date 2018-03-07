let NAME;

$(document).ready(() => {
    /* Login */
    let name = prompt("Please enter your name:", "");
    NAME = name;
    $.post("/login", {name: name}, (data) => {
        data = JSON.parse(data);
        $("#greeting").text("Welcome, " + data["name"]);
    });

    /* Submit message */
    $("#msgSubmit").click(() => {
        let dataOut = {
            name: NAME,
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
    $.post("/sender", {name: NAME}, (data) => {
        let messages = JSON.parse(data).message;
        for (let i = 0; i < messages.length; i++) {
            let curr = messages[i];
            let newMsg = $("<div></div>");
            let temp = $("<p></p>");
            temp.html("<p>" + curr.name + " " + "<small>" + curr.time + "</small></p>");
            newMsg.append(temp);
            temp = $("<p></p>");
            temp.text(curr.message);
            newMsg.append(temp);
            $("#display").append(newMsg);
        }
    });
}



let me = {};
let interval;
let active = "Lobby";
let onlineList = [];
let chatRooms = {};


$(document).ready(() => {
    /* Login */
    me.name = $("#username").text();
    Object.freeze(me);
    $.post("/login", {name: me.name}, (data) => {
        data = JSON.parse(data);
        let onlineUsers = data["online"];
        for (let i = 0; i < onlineUsers.length; i++) {
            newUser(onlineUsers[i]);
            onlineList.push(onlineUsers[i]);
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

    /* Tab */
    boundTab("#tab a");

    /* Start new chatting */
    $("#add").click(() => {
        $("#chooseList").children().remove(".form-check");
        $("#roomTitle").removeClass("is-valid is-invalid");
        $("#roomTitleFeedback").removeClass("valid-feedback invalid-feedback");
        $("#roomTitleFeedback").text("");
        $("#roomTitle").val("");

        for (let i = 0; i < onlineList.length; i++) {
            let curr = onlineList[i];
            if (curr === me.name) continue;
            let temp = $('<div class="form-check"></div>');
            temp.html(`<input class="form-check-input" type="checkbox" value="" id="check${curr}">
                     <label class="form-check-label" for="check${curr}">${curr}</label>`);
            $("#chooseList").append(temp);
        }
    });

    $("#roomTitle").on("keyup paste", () => {
        $.post("/validate", {type: "roomTitle", value: $("#roomTitle").val()}, (data) => {
            $("#roomTitle").removeClass("is-valid is-invalid");
            $("#roomTitleFeedback").removeClass("valid-feedback invalid-feedback");
            if (data === "1") {
                $("#roomTitle").addClass("is-valid");
                $("#roomTitleFeedback").addClass("valid-feedback");
                $("#roomTitleFeedback").text("Sounds a good name!");
            } else {
                $("#roomTitle").addClass("is-invalid");
                $("#roomTitleFeedback").addClass("invalid-feedback");
                $("#roomTitleFeedback").text("This group has already existed.");
            }
        });
    });

    $("#chooseSubmit").click(() => {
        let members = [];
        members.push(me.name);
        let title = $("#roomTitle").val();
        if ((title === "") || $("#roomTitle").attr("class").indexOf("invalid") >= 0) return;
        $("#chooseList").find("input").each((i, item) => {
            if (item.checked) members.push(item.id.slice(5));
        });
        if (members.length <= 1) return;
        $.post("/start", {title: title, members: members.toString()}, (data) => {
            $("#chooseUser").modal("hide");
            polling();
        });
    });
});

/* Handle error */
$(document).ajaxError(() => {
    interval = clearInterval(interval);
});


function polling() {
    $.post("/sender", {name: me.name}, (data) => {
        data = JSON.parse(data);

        /* Handle new groups */
        if (data.new !== undefined) {
            for (let i = 0; i < data.new.length; i++) {
                let curr = data.new[i];
                chatRooms[curr.title] = curr.members;
                let temp = $('<li class="nav-item dropdown"></li>');
                temp.append($(`<a id="${curr.title}" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">${curr.title}</a>`));
                temp.append($(`<div class="dropdown-menu"><a class="dropdown-item" id="${curr.title}Quit">Quit</a></div>`));
                $("#tabList").append(temp);
                boundTab("#" + curr.title);
                boundQuit(curr.title);
                temp = $(`<div class="tab-content" id="${curr.title}Content"></div>`);
                temp.hide();
                $("#display").append(temp);
            }
        }

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
            $("#" + curr.room + "Content").append(newMsg);
            $("#display").scrollTop($("#display")[0].scrollHeight);
        }


        /* Handle user arrival */
        if (data.arrive !== undefined) {
            for (let i = 0; i < data.arrive.length; i++) {
                newUser(data.arrive[i]);
                onlineList.push(data.arrive[i]);
            }
        }

        /* Handle user quit group */
        if (data.quitGroup !== undefined) {
            for (let i = 0; i < data.quitGroup.length; i++) {
                let curr = data.quitGroup[i];
                let groupName = curr[1];
                let quitUser = curr[0];
                remove(chatRooms[groupName], quitUser);
                if (active === groupName) $("#" + quitUser + "Tag").hide();
            }
        }


        /* Handle user quit */
        if (data.quit !== undefined) {
            for (let i = 0; i < data.quit.length; i++) {
                let user = data.quit[i];
                $("#" + user).remove();
                for (let key in chatRooms) {
                    if (chatRooms[key].contains(user)) remove(chatRooms[key], user);
                }
            }
        }
    });
}

function newUser(name) {
    let temp = $("<li></li>");
    temp.attr("id", name + "Tag");
    temp.attr("class", "list-group-item");
    temp.html(`<i class="fa fa-check-square" aria-hidden="true"></i> ${name}`);
    $("#onlineUsers").append(temp);
}

function sendMessage() {
    if ($("#msgInput").val() === "") return;
    let dataOut = {
        room: active,
        name: me.name,
        message: $("#msgInput").val()
    };
    $("#msgInput").val("");
    $.post("/receiver", dataOut, (data) => {
        polling();
    });
}

function boundTab(selector) {
    $(selector).click((e) => {
        let thisId = e.target.id;
        if (active !== thisId && thisId !== "Lobby") {
            $("#" + thisId).dropdown("toggle");
        }
        active = thisId;
        $("#tab a").removeClass("active");
        $("#" + thisId).addClass("active");
        $(".tab-content").hide();
        $("#" + active + "Content").show();
        if (active === "Lobby") {
            $("#onlineUsers").children().show();
        } else {
            $("#onlineUsers").children().hide();
            let activeRoom = chatRooms[active];
            for (let i = 0; i < activeRoom.length; i++) {
                $("#" + activeRoom[i] + "Tag").show();
            }
        }
    });
}

function boundQuit(name) {
    $("#" + name + "Quit").click(() => {
        $.post("/quit", {name: me.name, group: active}, (data) => {
            $("#" + name + "Content").remove();
            $("#" + name).parent().remove();
            delete chatRooms[name];
            active = "Lobby";
            $("#tab a").removeClass("active");
            $("#Lobby").addClass("active");
            $(".tab-content").hide();
            $("#LobbyContent").show();
            $("#onlineUsers").children().show();
        });
    });
}

function remove(array, val) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === val) {
            array.splice(i, 1);
            break;
        }
    }
}
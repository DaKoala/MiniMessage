import json
from util import *
from copy import deepcopy
from __init__ import app
from flask import render_template
from flask import request

chat_id = 0
users_online = []
users_message = {}
users_addition = {}
chat_groups = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    data_in = request.form.to_dict()  # {'name': 'xxx'}
    user = data_in["name"]
    # TODO: The server should check if the username is available.
    users_online.append(user)
    users_message[user] = []
    users_addition[user] = {}
    data_out = {"name": user, "online": [user]}
    for other in users_online:
        if other != user:
            data_out["online"].append(other)
            users_addition[other]["arrive"] = users_addition[other].get("arrive", [])
            users_addition[other]["arrive"].append(user)
    return json.dumps(data_out)


@app.route("/receiver", methods=["POST"])
def receive():
    new_message = request.form.to_dict()  # {'name': 'xxx', 'message': 'xxx', 'room': 'xxx'}
    new_message["time"] = timef()
    group_name = new_message["room"]
    for u in chat_groups[group_name]:
        users_message[u].append(new_message)
    return "Success"


@app.route("/sender", methods=["POST"])
def send():
    user = request.form.to_dict()["name"]
    data_out = dict()
    data_out["message"] = deepcopy(users_message[user])
    users_message[user] = []
    print(users_addition)
    if len(users_addition[user]) != 0:
        for k, v in users_addition[user].items():
            data_out[k] = v
        users_addition[user] = {}
    print(data_out)
    return json.dumps(data_out)


@app.route("/quit", methods=["POST"])
def leave():
    data = request.form.to_dict()
    user = data["name"]
    group_name = data.get("group", None)

    if group_name is None:
        users_online.remove(user)
        del users_message[user]
        del users_addition[user]
        for u in users_addition.keys():
            users_addition[u]["quit"] = users_addition[u].get("quit", [])
            users_addition[u]["quit"].append(user)
        print(users_addition)
        return "Bye!"
    else:
        chat_groups[group_name].remove(user)
        if len(chat_groups[group_name]) == 0:
            del chat_groups[group_name]
        for u in chat_groups[group_name]:
            users_addition[u]["quitGroup"] = users_addition[u].get("quitGroup", [])
            users_addition[u]["quitGroup"].append([user, group_name])
        return "Bye!"


@app.route("/start", methods=["POST"])
def start():
    form = request.form.to_dict()
    title = form["title"]
    members = form["members"].strip().split(",")
    for u in members:
        users_addition[u]["new"] = users_addition[u].get("new", [])
        users_addition[u]["new"].append({"title": title, "members": members})
    chat_groups[title] = members
    return "1"


@app.route("/validate", methods=["POST"])
def validate():
    form = request.form.to_dict()
    type = form["type"]

    if type == "roomTitle":
        room_title = form["value"]
        if room_title == "Lobby" or room_title in chat_groups:
            return "0"
        else:
            return "1"

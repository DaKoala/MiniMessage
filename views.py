import json
from util import *
from copy import deepcopy
from __init__ import app
from flask import render_template
from flask import request

chat_id = 0
users_online = []
users_message = {}
users_addtion = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data_in = request.form.to_dict()
        user = data_in["name"]
        users_online.append(user)
        users_message[user] = []
        users_addtion[user] = {}
        data_out = {"name": user, "online": [user]}
        for other in users_online:
            if other != user:
                data_out["online"].append(other)
        return json.dumps(data_out)


@app.route("/receiver", methods=["POST"])
def receive():
    if request.method == "POST":
        new_message = request.form.to_dict()
        user = new_message["name"]
        new_message["time"] = timef()
        for u in users_message.keys():
            users_message[u].append(new_message)
        return "Success"


@app.route("/sender", methods=["POST"])
def send():
    if request.method == "POST":
        user = request.form.to_dict()["name"]
        data_out = {}
        data_out["message"] = deepcopy(users_message[user])
        users_message[user] = []
        print(users_addtion)
        if len(users_addtion[user]) != 0:
            for k, v in users_addtion[user].items():
                data_out[k] = v
            users_addtion[user] = {}
        print(data_out)
        return json.dumps(data_out)


@app.route("/quit", methods=["POST"])
def quit():
    if request.method == "POST":
        user = request.form.to_dict()["name"]
        users_online.remove(user)
        del users_message[user]
        del users_addtion[user]
        for u in users_addtion.keys():
            users_addtion[u]["quit"] = users_addtion[u].get("quit", [])
            users_addtion[u]["quit"].append(user)
        print(users_addtion)
        return "Bye!"






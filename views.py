import json
from util import *
from copy import deepcopy
from __init__ import app
from flask import render_template
from flask import request

chat_id = 0
users_online = []
users_message = {}


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
        return json.dumps(data_out)







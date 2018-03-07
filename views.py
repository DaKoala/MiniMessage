import json
from util import *
from __init__ import app
from flask import render_template
from flask import request

current_id = 0
users = {}
message_queue = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data_in = request.form.to_dict()
        users[data_in["name"]] = current_id - 1
        data_out = data_in.copy()
        return json.dumps(data_out)


@app.route("/receiver", methods=["POST"])
def receive():
    global current_id
    if request.method == "POST":
        new_message = request.form.to_dict()
        new_message["time"] = timef()
        new_message["id"] = current_id
        current_id += 1
        message_queue.append(new_message)
        print(message_queue)
        return "Success"


@app.route("/sender", methods=["POST"])
def send():
    if request.method == "POST":
        user = request.form.to_dict()["name"]
        data_out = {}
        message_list = []
        for msg in message_queue:
            if msg["id"] > users[user]:
                message_list.append(msg)
                users[user] += 1
        data_out["message"] = message_list
        return json.dumps(data_out)







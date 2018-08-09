import os
import requests

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel_list = ['general']
messages = []
channel_list_msg = {'general': None}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/announcements")
def announcements():
    return render_template("announcements.html")

# Access of the resources as provided by the api.
@app.route("/resources")
def resources():
    requested = requests.get('https://newsapi.org/v2/top-headlines?' + 'sources=bbc-news&' + 'apiKey=ba291f3f40a4435b81432857ebc6015f')
    requested2 = requests.get('https://newsapi.org/v2/top-headlines?' + 'sources=the-new-york-times&' + 'apiKey=ba291f3f40a4435b81432857ebc6015f')
    if (requested.status_code != 200) and (requested2.status_code != 200):
        raise Exception("Unsuccessful API Access")
    data = requested.json()
    data2 = requested2.json()
    rd = []
    rd2 = []
    for i in range(10):
        title = data["articles"][i]["title"]
        description = data["articles"][i]["description"]
        url = data["articles"][i]["url"]

        title2 = data2["articles"][i]["title"]
        description2 = data2["articles"][i]["description"]
        url2 = data2["articles"][i]["url"]

        case = {'title': title, 'description': description, 'url': url}
        case2 = {'title': title2, 'description': description2, 'url': url2}
        rd.append(case)
        rd2.append(case2)
    return render_template("resources.html", rd=rd, rd2=rd2)
# Chat
@app.route("/chat")
def chat():
    return render_template("chat.html")

@socketio.on("current messaging")
def load_curr_msg(data):
    passed_data = {"data": data, "channel_list_msg": channel_list_msg}
    emit("current messaging returned", passed_data, broadcast=True)

@socketio.on("connection validated")
def connection_valid():
    loaded_channels = list(channel_list_msg.keys())
    emit('channels_lists', loaded_channels, broadcast=True)

@socketio.on("submit message")
def submit(data):
    selection = data
    channel_list_msg[data["curr_channel"]] = data["set_msg"]
    emit("message_sent", data, broadcast=True)

@socketio.on("channel added")
def added(data):
    listed = list(channel_list_msg.keys())
    for i in range(len(channel_list_msg.keys())):
        if data == listed[i]:
            return;
    channel_list_msg[data] = None
    new_channel = data
    emit("created new channel", new_channel, broadcast=True)


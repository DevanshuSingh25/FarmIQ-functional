from flask import Flask, request, send_file
from flask_cors import CORS
from gtts import gTTS
import uuid
import os

app = Flask(__name__)
CORS(app)  # allow all domains to call the API

# Create audio folder if not exists
if not os.path.exists("audio"):
    os.makedirs("audio")

@app.post("/tts")
def tts():
    data = request.json
    text = data["text"]
    lang = data["lang"]  # "en", "hi", "pa"

    filename = f"audio/{uuid.uuid4()}.mp3"

    tts = gTTS(text=text, lang=lang)
    tts.save(filename)

    return send_file(filename, mimetype="audio/mp3")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

import spacy
import requests
from flask_cors import CORS 
from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)
SMMRY_API_KEY = "92E708A8B3"

def get_transcript(video_id, percent):
	transcript = {}
	try:
		transcript = YouTubeTranscriptApi.get_transcript(
					 video_id,languages=["en"])
	except:
		return {"message":"No transcript found"}
	transcript_string = " "
	for line in transcript:
		transcript_string += line['text']+" "
	return identify_sentences(transcript_string, percent)

def identify_sentences(transcript_string, percent):
	nlp = spacy.load("en_core_web_sm")
	doc = nlp(transcript_string)
	sentences = doc.sents
	transcript_with_sentences=""
	num_sentences = 0
	for sentence in doc.sents:
		transcript_with_sentences+=sentence.text+".\n ";
		num_sentences+=1
	return get_summary(transcript_with_sentences, percent, num_sentences)
def get_summary(transcript, percent, num_sentences):
	summary_length= round(float(percent)*num_sentences)
	api_url= ("http://api.smmry.com/&SM_API_KEY=%s&SM_LENGTH=%s" 
			% (SMMRY_API_KEY,summary_length))
	r = requests.post(api_url, data={"sm_api.input":transcript})
	return r.json()["sm_api_content"]

@app.route("/")
def summarize():
	video_id = request.args.get("video_id")
	percent_to_summarize= request.args.get("percent")
	summary=get_transcript(video_id, percent_to_summarize)
	return {"summary":summary}





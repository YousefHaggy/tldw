async function getSummary(videoId){
	let percentLengthOfSummary = document.getElementById("slider").value / 100;
	let summary = await fetch(`http://127.0.0.1:5000/?video_id=${videoId}&percent=${percentLengthOfSummary}`,{
		method:'GET',
	}).catch((error) => {
	document.getElementById('messages').innerHTML=error;
	});
	let summary_json= await summary.json();
	if ("error" in summary_json)
		document.getElementById('messages').innerHTML="Error, no transcript found";
	else{
		document.getElementById('messages').innerHTML="Summary generated!";

	chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id,{summary:summary_json}, function(response){
		});
	});
}
	}
let summaryButton= document.getElementById("summaryButton");
summaryButton.onclick=function(element){
	chrome.tabs.getSelected(null,function(tab) {
		let url = tab.url;
		if (url.indexOf("youtube.com/watch")!=-1){
			videoId=url.split("?v=")[1].substring(0,11);
			document.getElementById('messages').innerHTML="Loading summary...";
			getSummary(videoId);
		}
		else{
			document.getElementById('messages').innerHTML="No youtube video found";
		}
	});
}
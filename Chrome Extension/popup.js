async function getSummary(videoId){
	let percentLengthOfSummary = document.getElementById("slider").value / 100;
	let summary = await fetch(`http://127.0.0.1:5000/?video_id=${videoId}&percent=${percentLengthOfSummary}`,{
		method:'GET',
		mode:'no-cors',
	})
	console.log(summary);
	chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id,{summary:summary}, function(response){

		})
	});

	}
let summaryButton= document.getElementById("summaryButton");
summaryButton.onclick=function(element){
	chrome.tabs.getSelected(null,function(tab) {
		let url = tab.url;
		if (url.indexOf("youtube.com")!=-1){
			videoId=url.split("?v=")[1].substring(0,11);
			document.getElementById('debug').innerHTML=videoId;
			getSummary(videoId);
		}
		else{
			document.getElementById('debug').innerHTML="No youtube video found";
		}
	});
}
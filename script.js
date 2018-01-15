
var string="no";
var $res;
var textSent="o";
var textEmo="x";
var valSent=0;
var valAnger=0;
var valSurprise=0;
var valFear=0;
var valSadness=0;
var valJoy=0;
var dict={none: -1,anger:-1,surprise:-1,fear:-1,sadness:-1,joy:-1};

function showInfo(){
	var r="Sentiment Value 0-1= "+valSent+"\n    Anger= "+dict.anger+"\n     Surprise= "+dict.surprise+"\n     Sadness= "+dict.sadness+"\n     Fear= "+dict.fear+"\n     Joy= "+dict.joy;
	document.getElementById("string").innerHTML=r;
}


function post(){
	 $.post(
	  'https://apiv2.indico.io/sentiment',
	    JSON.stringify({
	    'api_key': "3eb52ed34aa42224226d71ed6470ac63",
	    'data': string,
	  })
	).done(function(res) { textSent= res; parseSentiment(textSent);});

 //return res;
 /*var text= JSON.stringify({
    'api_key': "3eb52ed34aa42224226d71ed6470ac63",
    'data': "I love writing code!",
  });*/

}





function post2(){



 $.post(
  'https://apiv2.indico.io/emotion',
    JSON.stringify({
    'api_key': "3eb52ed34aa42224226d71ed6470ac63",
    'data': string,
    'threshold': 0.1
  })
).done(function(res) {  textEmo= res; parseEmotion(textEmo);});

 //return res;
 /*var text= JSON.stringify({
    'api_key': "3eb52ed34aa42224226d71ed6470ac63",
    'data': "I love writing code!",
  });*/

}
function parseSentiment(string){
	textSent=string.substring(12,string.length-1);

	valSent=parseFloat(textSent);
	getColorSentiment();
}
var keys=[];


//make a dictionary with keys and values of all emotions
function newGetKeys(text){
	dict={none: -1,anger:-1,surprise:-1,fear:-1,sadness:-1,joy:-1};
	var ang= text.indexOf("anger");
	var sur= text.indexOf("surprise");
	var sad= text.indexOf("sadness");
	var fea= text.indexOf("fear");
	var joy= text.indexOf("joy");
	text=text.substring(0,text.length)+",";

	if(ang!=-1){
		var end= text.substring(ang).indexOf(",");
		var beg= text.substring(ang).indexOf(":")+2;
		var vAng= text.substring(beg,end);
		dict.anger=vAng;
	}
	

	if(sur!=-1){
		end= text.substring(sur).indexOf(",");
		beg= text.substring(sur).indexOf(":")+2;
		vAng= text.substring(sur).substring(beg,end);
		dict.surprise=vAng;
	}


	if(sad!=-1){
		end= text.substring(sad).indexOf(",");
		beg= text.substring(sad).indexOf(":")+2;
		vAng= text.substring(sad).substring(beg,end);
		dict.sadness=vAng;
	}
	

	if(fea!=-1){
		end= text.substring(fea).indexOf(",");
		beg= text.substring(fea).indexOf(":")+2;
		vAng= text.substring(fea).substring(beg,end);
		dict.fear=vAng;
	}
	

	if(joy!=-1){
		end= text.substring(joy).indexOf(",");
		beg= text.substring(joy).indexOf(":")+2;
		vAng= text.substring(joy).substring(beg,end);
		dict.joy=vAng;
	}
	

}



//regulate after sending emotion
function parseEmotion(string){
	textEmo=string.substring(13,string.length-2);
    newGetKeys(textEmo);
    changeEmoji();
}


function getColorSentiment(){
	colorVal= parseInt(valSent*255);
	var red= 255;
	var blue=parseInt(colorVal/1.5);
	var green=colorVal;
	var hex= rgbToHex(red,green,blue);
	document.getElementById("circle").style.background=hex;
	//document.getElementById("string").style.color=hex;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
//submits sentiment message



//insert text display and save to string 
$(document).ready(function() {
    $( "#submit" ).click(function() {
      string = $('#inputuser').val().toString();
      document.getElementById("string").innerHTML=string; 
      post(string);
      post2(string);
    });
  });

//works, finds max value and sets emoji
function changeEmoji(){
	var max=0;
	var maxOne;
	for(var key in dict){
		if(dict[key]>max){
			max=dict[key];
			maxOne=key;
		}
	}
	var val=dict.anger-max;
	if(val>0){
		maxOne="anger";
	}
	var pic;
	if(maxOne=="anger"){
		if(max>.2){
			pic="anger2.gif";
		}
		else{
			pic="anger1.gif";
		}
	}
	else if(maxOne=="surprise"){
		pic="surprise.gif";
	}
	else if(maxOne=="sadness"){
		if(max>.5){
			pic="sad2.gif";
		}
		else{
			pic="sad1.gif";
		}
	}
	else if(maxOne=="fear"){
		if(max>.5){
			pic="fear2.gif";
		}
		else{
			pic="fear1.gif";
		}
	}
	else{
		if(max>.5){
			pic="joy2.gif";
		}
		else{
			pic="joy1.gif";
		}
	}
	if(string=="tsun"){
		pic="tsun.gif";
	}

	document.getElementById("myImg").src = pic;
}
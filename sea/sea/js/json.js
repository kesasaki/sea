function loadJson(fileName){
   httpObj = new XMLHttpRequest();
   httpObj.open('GET',fileName,true);
   httpObj.send(null);
   httpObj.onreadystatechange = function(){
      if( ( httpObj.readyState == 4) && (httpObj.status == 200)){
         return JSON.parse(httpObj.responseText);
      }
   }
}

function saveJson(filename){
	

}


var json = loadJson("sample.json");
for(var i in json){
    console.log(i + " " + json[i]);
}
function getScriptUrl() {
  var scriptUrl = ScriptApp.getService().getUrl();
  return scriptUrl;
}

//this include function and the next function are based up Chicago Computer Classes tutorial https://www.youtube.com/watch?v=f9dqsHDrQCc
function include (filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function retrieveClasses(){
  var CS = SIDSheet //name of tab where the SID class list is located
  var clist = CS.getRange(2, 1, CS.getRange("A2").getDataRegion().getLastRow()-1,CS.getRange("A2").getDataRegion().getLastColumn()).getDisplayValues();
  var cDisplay = new Array();

  for (var i = 0, rows = clist.length; i < rows; i++) {// This loop is for outer array - the rows in the spreadsheet
    cDisplay.push({'classID':clist[i][0], 'courseName':clist[i][1],'startTime':clist[i][3],'endTime':clist[i][4], 'teacher':clist[i][8], 'site':clist[i][10]});
   
  }
  
  return(cDisplay);   
}

//this is reading Google Drive to get the audio files.  Chicago Computer Classes has a great turorial at https://www.youtube.com/watch?v=PTOKHjVkXYs

//The data model for this is clumsy.  Maybe give each question and each answer an ID.  Then name the audio files by ID and language code??  Right now, the name of the audio file has to match the question text perfectly or it won't return the audio.
function getDownloadUrls(){
  var downloadUrls = [];
  
  var parFolderIter = DriveApp.getFoldersByName("Survey Audio Files");
  var parFolder = parFolderIter.next();
  
  var subFoldersIter = parFolder.getFolders();
  var subFolders = [];
  
  while (subFoldersIter.hasNext()){
    var folder = subFoldersIter.next();
    var folderName = folder.getName();
    var tempLang = folderName.match(/[A-Z][a-z]+/);//this should grab the first capitalized word
    var lang = tempLang[0];
    var fileIter = folder.getFiles();
    

    while (fileIter.hasNext()){
      var file = fileIter.next();
      var name = file.getName();
      var url = file.getDownloadUrl();   
      
      //console.log(url);
      downloadUrls.push({'language':lang, 'name':name, 'url':url});
    }
    
  }
  
  return downloadUrls;
  
 
  
}


//Additional question types could be developed here.  I've included radio buttons, text box and comment box.  You could do any kind of question that you can write the Html for.  
function retrieveQuestions(workSheet){
  var WS =workSheet //name of tab where the questions are located
  var qlist = WS.getRange(2, 1, WS.getRange("A2").getDataRegion().getLastRow()-1,WS.getRange("A2").getDataRegion().getLastColumn()).getValues();
  var htmlList = new Array();

  for (var i = 0, l1 = qlist.length; i < l1; i++) {// This loop is for outer array, the questions- the rows in the spreadsheet
    
    //start radio button loop
    if (qlist[i][0] == "radio"){
      qlist[i].shift();

      for (var j = 0, l2 = qlist[j].length; j < l2; j++) {// This loop is for inner-arrays, the answers for multiple choice - the columns in the spreadsheet
  
        if(qlist[i][j].length > 0){// strip the blanks - some questions have more options/columns than others and the array may have blanks in it
  
          if(j==0){// writes the html for the question prompt
   
            var qText = qlist[i][j];
            var groupId = qlist[i][j];
            var outer = i
            var inner = j
            var audId = outer.toString() + "-" + inner.toString();
              
            htmlList.push('<div class ="tab"><div class="row"><p>' + qlist[i][j] + '<audio class = "audio" id ="'+audId+'" title="'+qlist[i][j]+'" controls preload="metadata"><source src=""></audio></p></div><br>');
            
          }else{// writes the html for the radio buttons
              
            var aText = qlist[i][j];
            var outer = i
            var inner = j
            var audId = outer.toString() + "-" + inner.toString();
  
            htmlList.push('<div class ="row"><input type="radio" id="'+aText+'" name="'+groupId+'" value="' +aText+'" required /><label for="'+aText+'">'+aText+'<audio class = "audio" id ="'+audId+'" title="'+aText+'" controls preload="metadata"><source src=""></audio></label></div>');

          };
        };
      };

      htmlList.push('</div>');

    };
     
    //start text box loop
    if (qlist[i][0] == "text box"){
      qlist[i].shift();
      
      var qText = qlist[i][0];
      var outer = i
      var inner = 0
      var audId = outer.toString() + "-0";//inner.toString();//create a unique id for each audio file to be referenced in HTML when loading audio files
              
      htmlList.push('<div class ="tab"><div class="row"><p>' + qlist[i][0] + '<audio class = "audio" id ="'+audId+'" title="'+qlist[i][0]+'" controls preload="metadata"><source src=""></audio></p></div><div class="row"><input type="text" name="'+qlist[i][0]+'" placeholder="Type response here." required/></div></div>');
      
      
    };

    //start comment box loop
    if (qlist[i][0] == "comment box"){
      qlist[i].shift();
      
      var qText = qlist[i][0];
      var outer = i
      var inner = 0
      var audId = outer.toString() + "-0";//inner.toString();//create a unique id for each audio file to be referenced in HTML when loading audio files
              
      htmlList.push('<div class ="tab"><div class="row"><p>' + qlist[i][0] + '<audio class = "audio" id ="'+audId+'" title="'+qlist[i][0]+'" controls preload="metadata"><source src=""></audio></p></div><div class="row"><textarea name="'+qlist[i][0]+'" placeholder="Type response here." rows="10" cols="50" required></textarea>/</div></div>');
      
      
    };

  };
  
  var questionsHtml = htmlList.join("");
  console.log(questionsHtml);
  return questionsHtml;
  

};

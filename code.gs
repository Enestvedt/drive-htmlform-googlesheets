const SS = SpreadsheetApp.getActiveSpreadsheet();
const resSheet = SS.getSheetByName('Responses'); //this is the sheet where survey responses are recorded
const qSheet = SS.getSheetByName('Survey Questions');
const SIDSheet = SS.getSheetByName('Class Directory')//this is my class roster from a learner management system 


//doGet to create the webpages.  The HtmlService calls functions to retrieve questions, the school's classes from a spreadsheet, and audio files from Google Drive and then builds the html page and serves the content  
function doGet(){
  var tmp = HtmlService.createTemplateFromFile('index');
  tmp.questions = retrieveQuestions(qSheet);
  tmp.classInfo = JSON.stringify(retrieveClasses());
  tmp.scriptUrl = getScriptUrl();
  tmp.audioUrls = JSON.stringify(getDownloadUrls());
  return tmp.evaluate();
  
}


//doPost to submit the responses.  I got the idea for submitting the form using doPost with fetch API from Jamie Wilson - https://github.com/jamiewilson/form-to-google-sheets

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
  
    var headers = resSheet.getRange(1, 1, 1, resSheet.getLastColumn()).getValues()[0]
    var nextRow = resSheet.getLastRow() + 1

    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    resSheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
      
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}

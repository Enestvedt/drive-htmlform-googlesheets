# drive-htmlform-googlesheets
Google Apps Script reads a google Sheet to to dynamically create an Html survey.  It reads Google Drive folder to load audio files that correspond with each question and possible response.  It then records responses to a Google sheet.  

//Thank you to Chicago Computer Classes YouTube Channel (https://www.youtube.com/c/LearnGoogleSpreadsheets/featured) where I learned to do most of what follows.


//This is a container bound script.  It reads a spreadsheet and creates a paginated survey for each question is findes in the sheet (whatever you add to the sheet, it will generate on the survey).  Each submission is then stored on another sheet in the Spreadsheet.  In addition, it requires a language selection and audio interprets the English text to the selected language if it finds an audio file in the Drive that matches the text and the language selction.

//Users' cross-site tracking cannot be disabled in Safari settings (appears to be unique to Safari).  When that service is enabled, audio will not load from G Drive.  You can turn it off in preferences - it is a user setting.

//Set-up:
//Create a new Google spreadsheet with separate sheets: 1. Responses, 2. Survey Questions, 3. Class Directory that you want to ask on in a specific format. Also, create a folder called "Survey Audio Files" and place the audio that you would like to accompany each question and each possible response.  You should have one sub-folder for each language that you will support, e.g. "Spanish Audio".  My survey is delivered in English, but has audio interpretation in, Amharic, Arabic, French, Hmong, Nepali, Oromo, Somali, Spanish, and Tigrina.  You don't have to have those.  Just include languages that you want.  When you name the audio file, it must be exactly the same as the on screen text of the question in English including capitalization and punctuation and keep them in language-designated folders. 

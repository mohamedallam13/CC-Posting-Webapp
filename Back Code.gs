///////////////////////////////////////////////////////////////////////////////////////JSON FUNCTIONS

function doGet(e) {

  //sheet = ss.getSheetByName('Options')
  //var list = sheet.getRange(1,1,sheet.getRange('A1').getDataRegion().getLastRow(),1).getValues()
  
  //the other way, in which the code included in the html is simpler:
  
  //var htmlListArray = list.map(function(r){return '<option>'+r[0]+'</option>';}).join() 
  //map will output:  ['<option>A</option>','<option>B</option>','<option>C</option>',..] and the join will convert them to 1 sring and remove the commas -> '<option>A</option><option>B</option><option>C</option>'
  
  
  var tmp = HtmlService.createTemplateFromFile("page");
  var list = [1,2,3]
  
  
  tmp.title = "Refunds Retrieval"
  
  
          
  var htmlListArray = list.map(function(r){return '<option>'+r[0]+'</option>';}).join() 
  
  tmp.list = htmlListArray
  
    //tmp.list = list.map(function(r){return r[0];}) 
  
    //We use map because the result from list =[[A],[B],[C],..] so we need to convert it to single dim array
  
    // This is one way to do it if the code will be included in the following form:
    /*
    
    <? for(var i=0; i<list.length;i++){ ?>
    
    <option><?= list[i]; ?></option>
    
    <? }; ?>
    
    */
  
  return tmp.evaluate();
  
}


function include(filename){

  return HtmlService.createHtmlOutputFromFile(filename).getContent()


}







///////////////////////////////////////////////////////////////////////////////////////JSON FUNCTIONS


var scriptProperties = PropertiesService.getScriptProperties();
var ssid = '1Oo9dPyR3vHqu9hDpDgg8Tb_Fd7LrqFpeDINxrZT06q4'
var sheetname = 'Refunds'
var fileId = ''

function JSONExtractor() {
  //With Normal Google SpreadsheetApp services
 
  var ss = SpreadsheetApp.openById(ssid)
  var sheet = ss.getSheetByName(sheetname)
  
  // how to snap to last data row without having to filter (typically valid for first columns that include manual entry, not valid for arrayformulas)
  //var Direction=SpreadsheetApp.Direction;
  //var range = sheet.getRange(1, 18)
  //Logger.log(range.getNextDataCell(Direction.DOWN).getRow());
  
  var Direction=SpreadsheetApp.Direction;
  var datarange = sheet.getSheetValues(1,1,sheet.getRange(1,1).getNextDataCell(Direction.DOWN).getRow(),sheet.getLastColumn())
  var headers = datarange.shift()
  
  //TBC

  
}

function JSONExtractorAdv() {
  //With Advanced Google SpreadsheetApp services
  

  var ss = SpreadsheetApp.openById(ssid);
  var sheet = ss.getSheetByName(sheetname);
  
  // how to snap to last data row without having to filter (typically valid for first columns that include manual entry, not valid for arrayformulas)
  //var Direction=SpreadsheetApp.Direction;
  //var range = sheet.getRange(1, 18)
  //Logger.log(range.getNextDataCell(Direction.DOWN).getRow());
  
  var Direction=SpreadsheetApp.Direction;
  var lastrow = sheet.getRange(1,1).getNextDataCell(Direction.DOWN).getRow();
  var sheetA1not = sheetname + '!' + sheet.getRange(1,1).getA1Notation() + ":" + sheet.getRange(lastrow,sheet.getLastColumn()).getA1Notation();
  var fulldata = Sheets.Spreadsheets.Values.get(ssid,sheetA1not);
  var datarange = fulldata.values
  var headers = datarange.shift()
  var keys = normalizeHeaders_(headers);
  var prop = 'stockId'
  
  Logger.log(datarange);
  Logger.log(keys);
  
  /*

  var groupedby = 'Stock ID'
  var gbci = headers.indexOf(groupedby);
  var unique = datarange.map(function(value,index) { return value[gbci]; }).filter(function(value,index,self) { return self.indexOf(value) === index; }); //very useful
  var groupingobj = {}
  
  for (var i = 0; i < unique.length ; i++){
    
    currentgrouper = unique[i]  
    var filtered = datarange.filter(function (row) {
      return row[gbci] === currentgrouper;
    });
    
    Logger.log(filtered)
    
    var objarr = []
    
    for (var j = 0; j < filtered.length ; j++){
      
      var obj = {}
      
      for( var k = 0; k < keys.length ; k++){
        
        obj[keys[k]] = filtered[j][k]
        
      }
      
      objarr.push(obj)
      
    }
    
  groupingobj[currentgrouper] = objarr   
    
    
  }
  
  Logger.log(groupingobj)
  
  */
 

  var objarr = [];
  for (var i = 0 ; i < datarange.length ; i++){
    
    var obj = {};
    
    for (var j = 0 ; j < keys.length ; j++){
      
      obj[keys[j]] = datarange[i][j]; 
      
    }
    
    objarr.push(obj);
    
  }
  
  
  var groupingobj =  _.groupBy(objarr, prop);

  var JSONExtract = JSON.stringify(groupingobj,null,4);
  
  if(scriptProperties.getProperty('JSONfileId') !== null){
    
    fileId = scriptProperties.getProperty('JSONfileId');
    Logger.log(fileId);
    var file = DriveApp.getFileById(fileId);
    file.setContent(JSONExtract);
    
  }else{
  
    var file = DriveApp.createFile("RefundsAll.json", JSONExtract, MimeType.PLAIN_TEXT);
    fileId = file.getId();
    scriptProperties.setProperty('JSONfileId', fileId);
    Logger.log(fileId);
  
  }
  


  
}


function getFromJSON(input){
  
  //var input = 'JD68917'

  fileId = scriptProperties.getProperty('JSONfileId');
  Logger.log(fileId);
  var file = DriveApp.getFileById(fileId);
  var groupobj = JSON.parse(file.getBlob().getDataAsString())
  
  var result = groupobj[input]
  
  //Logger.log(groupobj[Object.keys(groupobj)[0]])
  //result.unshift(
  
  //Logger.log(groupobj)
  
  Logger.log(result)
  
  return result;


}


function userClicked(logInfo){
  
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-sZ_0vCV488OdaBOXI9aSEjHFW62O4TVtuQdjD-qEAw/edit#gid=75432572');
  sheet = ss.getSheetByName('Log');
  sheet.appendRow([logInfo.sID, logInfo.inputer, logInfo.inputdate,logInfo.sID2,logInfo.purchasingcountry,new Date()]);
  Logger.log(userinfo);


}
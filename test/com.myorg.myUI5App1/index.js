
var XMLPath = "./uimodule/webapp/view/MainView.view.xml";
var rawJSON = loadXMLDoc(XMLPath);
const xmlView = JSON.parse(rawJSON);
console.log(xmlView);

function nameToUpperCase(name) {
    return name.toUpperCase();
  }

function loadXMLDoc(filePath) {
  var fs = require("fs");
  var xml2js = require("xml2js");
  var json;
  try {
    var fileData = fs.readFileSync(filePath, "ascii");
    var parser = new xml2js.Parser();

    
    //transform all attribute and tag names and values to uppercase
    parser.parseString(
      fileData.substring(0, fileData.length),
      {
        tagNameProcessors: [nameToUpperCase],
        attrNameProcessors: [nameToUpperCase],
        valueProcessors: [nameToUpperCase],
        attrValueProcessors: [nameToUpperCase],
      },
      function (err, result) {
        // processed data
        json = JSON.stringify(result);
        console.log(JSON.stringify(result));
      }
    );

    console.log("File '" + filePath + "/ was successfully read.\n");
    return json;
  } catch (ex) {
    console.log(ex);
  }
}

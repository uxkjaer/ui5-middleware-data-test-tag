function nameToUpperCase(value, name){
    if (name === "id") {
    return `name: '${value}, data-testid: '${value}'`;
    }
    else {
        return name
    
    }
}
const util = require('util')

var fs = require("fs");


var parseString = require('xml2js').parseString;
var XMLPath = "./uimodule/webapp/view/MainView.view.xml";
var fileData = fs.readFileSync(XMLPath, "ascii");


//transform all attribute and tag names and values to uppercase
parseString(fileData.substring(0, fileData.length), {
    attrValueProcessors: [nameToUpperCase],
},
  function (err, result) {
    // processed data
    console.log(util.inspect(result, {showHidden: false, depth: null}))
    
});
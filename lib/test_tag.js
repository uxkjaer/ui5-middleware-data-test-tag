const log = require("@ui5/logger").getLogger(
    "builder:customtask:ui5-task-flatten-library"
  );
  
  const url = require("url");
  const path = require("path");
  const fs = require("fs");
  const dotenv = require("dotenv");
  const parseString = require("xml2js").parseString;
  const Builder = require("xml2js").Builder;
  dotenv.config();

  
  function add_test_tag(json_object, root, parent) {
    for (let item in json_object) {
      if (!root){
        root = json_object[item]
      }
      if (json_object[item].hasOwnProperty("id")) {
        if (!root["$"]['xmlns:core']){
          root["$"]['xmlns:core'] = 'sap.ui.core'
        }
        json_object[`${parent.includes(":") ? `${parent.split(":")[0]}:` : ''}customData`] = {
          "core:CustomData": {
            $: {
              key: "testid",
              value: json_object[item]["id"],
              writeToDom: true,
            },
          },
        };
      } else if (typeof json_object[item] === "object") {
        add_test_tag(json_object[item], root, (json_object[item][0] && json_object[item][0]["$"]) ? item : parent);
      }
    }
    return json_object;
  }
  
module.exports = function({resources}) {                // Receive list of resources to uglify
    return Promise.all(resources.map((resource) => {
        return resource.getString().then(async function(code) {    // Get resource content as string
            let newXML = function() { return new Promise((resolve,reject) => parseString(code, async function (err, result) { 

            result =  add_test_tag(result);
            const builder = new Builder();
            let codeString = builder.buildObject(result)
            codeString = codeString.replaceAll("&lt;","<").replaceAll("&gt;", ">")
            resource.setString(codeString);            // Update content of the resource
            resolve(resource);                            // Resolve with list of resources
        })
            )
    }
            return await newXML()
    })
    }));
};
const log = require("@ui5/logger").getLogger(
  "server:custommiddleware:data-test-tag"
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

function matcher(req) {
  if (req.url) {
    const parsed = url.parse(req.url);

    if (parsed.pathname.match(/\.xml$/)) {
      return parsed.pathname;
    }
  }
  return null;
}
/**
 * Custom UI5 Server middleware example
 *
 * @param {Object} parameters Parameters
 * @param {Object} parameters.resources Resource collections
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.
 *                                        all Reader or Collection to read resources of the
 *                                        root project and its dependencies
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.
 *                                        rootProject Reader or Collection to read resources of
 *                                        the project the server is started in
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.dependencies
 *                                        Reader or Collection to read resources of
 *                                        the projects dependencies
 * @param {Object} parameters.options Options
 * @param {string} [parameters.options.configuration] Custom server middleware configuration
 *                                                      if given in ui5.yaml
 * @returns {function} Middleware function to use
 */
// eslint-disable-next-line func-names
module.exports = function ({ options }) {
  const watchPath = options.configuration.path || "webapp/view";

  // eslint-disable-next-line func-names
  return function (req, res, next) {
    const pathname = matcher(req);
    const excludePath = options.configuration.exclude
      ? options.configuration.exclude.split(",")
      : [];

    if (pathname) {
      const file = path.join(process.cwd(), watchPath + pathname);
      const pathNameArr = pathname.split("/");
      pathNameArr.pop();
      if (
        excludePath.filter((sPath) => pathNameArr.toString().includes(sPath)) <
        1
      ) {
        let code;
        try {
          code = fs.readFileSync(file, "utf8");
          log.info(`Request for ${file} received.`);
        } catch (err) {
          log.error(`Request for ${file} failed.`);
          next();
        }

        if (code) {
          //transform all attribute and tag names and values to uppercase
          parseString(code.substring(0, code.length), function (err, result) {
            // processed data
            result = add_test_tag(result);
            const builder = new Builder();
            res.send(builder.buildObject(result));
          });
        }
      } else {
        log.info(
          `${file} is part of a library exclusion in the ui5.yaml file.`
        );
        next();
      }
    } else {
      next();
    }
  };
};

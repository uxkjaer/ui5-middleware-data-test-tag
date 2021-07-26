const log = require("@ui5/logger").getLogger(
  "builder:customtask:ui5-task-flatten-library"
);

const data_tag = require("./test_tag");

module.exports = function ({ workspace, options }) {
  // "workspace" is a DuplexCollection that represents the projects source directory (e.g. /webapp)
  // When calling the standard APIs "byGlob" and "byPath" it will also return resources that have
  //  just been created by other tasks.
  // The uglify task intents to only process those resources present in the project source directory
  //  therefore it calls the API "byGlobSource".
  return workspace
    .byGlobSource("/**/*.xml") // Collect all resources that shall be uglified. The caller provides the necessary GLOB pattern.
    .then((allResources) => {
      return data_tag({
        // Call to the processor
        resources: allResources, // Pass all resources
      });
    })
    .then((processedResources) => {
      // Receive list of changed and newly created resources
      return Promise.all(
        processedResources.map((resource) => {
          return workspace.write(resource); // Write them back into the workspace DuplexCollection
        })
      );
    });
};

function empty(x) { return x; }

function setup(sugar) {
  return sugar
    .use("metalsmith-metadata", { site: "site.json" })
    .use("metalsmith-static", { source: "static", destination: "." })
    .use("metalsmith-page-titles")
    .use("metalsmith-collections", {
      team: {
        pattern: "team/*.md",
        sort: "title"
      }
    })
    .use("metalsmith-filenames")
    .use("metalsmith-in-place", {
      engineOptions: {
        basedir: "layouts"
      }
    })
    .use("metalsmith-permalinks");
}

module.exports = function(before, after) {
  before = before || empty;
  after = after || empty;

  var sugar = require("metalsmith-sugar")({
    clean: true,
    destination: "_site",
    source: "source",
  });

  require("metalsmith-debug-ui").patch(sugar.metalsmith());

  after(setup(before(sugar))).build();
}
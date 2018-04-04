function empty(x) { return x; }

function setup(sugar) {
  return sugar
    .use("metalsmith-metadata", {
      site: "_data/site.yaml",
    })
    .use("metalsmith-static", { src: "static", dest: "." })
    .use("metalsmith-page-titles")
    .use("metalsmith-collections", {
      team: {
        pattern: "team/*.md",
        sort: "name"
      }
    })
    .use("metalsmith-filenames")
    .use("metalsmith-markdown-it")
    .use("metalsmith-in-place", {
      engineOptions: {
        basedir: "layouts",
        pretty: true,
      }
    })
    .use("metalsmith-sass", {
      sourceMap: true,
      sourceMapContents: true,
      outputDir: function(originalPath) {
        // this will change scss/some/path to css/some/path
        return originalPath.replace("sass", "css");
      }
    })
    .use("metalsmith-ignore", [
      "team/*"
    ])
    .use("metalsmith-permalinks", {
      relative: false,
    });
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
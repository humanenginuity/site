function empty(x) { return x; }

function setup(sugar) {
  return sugar
    // Setup
    .use("metalsmith-metadata", {
      site: "_data/site.yaml",
    })
    .use("metalsmith-filenames")
    .use("metalsmith-collections", {
      team: {
        pattern: "team/*.md",
        sort: "name"
      },
      tiles: {
        pattern: "landing-tiles/*.md",
        sortBy: "filename"
      },
    })
    .use("metalsmith-page-titles")
    .use("metalsmith-slug", {
      patterns: [ "*.md" ],
      mode: "rfc3986",
    })
    // Render
    .use("metalsmith-static", { src: "static", dest: "." })
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
      "team/**/*",
      "landing-tiles/**/*",
    ])
    .use("metalsmith-permalinks", {
      relative: false,
    })
    ;
}

module.exports = function(before, after) {
  before = before || empty;
  after = after || empty;

  var sugar = require("metalsmith-sugar")({
    clean: true,
    destination: "_site",
    source: "source",
  });

  after(setup(before(sugar))).build();
}
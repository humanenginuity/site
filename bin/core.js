function empty(x) { return x; }

function setup(opts, sugar) {

  if (opts.debug) {
    require("metalsmith-debug-ui").patch(sugar.metalsmith());
    sugar.use(function (files, metalsmith, done) {
      setImmediate(done);
      metalsmith.metadata({ debug: true });
    })
  }

  sugar = opts.before(sugar)
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
        pretty: opts.debug,
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
    });

    if (opts.debug) {
      sugar = sugar
        .use("metalsmith-uglify", {
          files: [
            "assets/js/jquery.scrolly.min.js",
            "assets/js/jquery.scrollex.min.js",
            "assets/js/skel.min.js",
            "assets/js/util.js",
            "assets/js/main.js",
          ],
          concat: {
            root: "assets/"
          },
          removeOriginal: true,
        })
        ;
    }

    return opts.after(sugar)
}

var defaults = {
  before: empty,
  after: empty,
  debug: false,
}

module.exports = function(opts) {
  opts = Object.assign({}, defaults, opts);

  var sugar = require("metalsmith-sugar")({
    clean: true,
    destination: "_site",
    source: "source",
  });

  setup(opts, sugar).build();
}
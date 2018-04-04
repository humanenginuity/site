function before(sugar) {
  return sugar
    .use("metalsmith-express")
    .use("metalsmith-watch", {
      paths: {
        '${source}/**/*': true
      },
      livereload: true
    });
}

require("./core.js")(before);
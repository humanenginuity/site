function before(sugar) {
  return sugar
    .use("metalsmith-express")
    .use("metalsmith-watch", {
      paths: {
        '${source}/**/*': "**/*",
        'layouts/**/*': "**/*",
        'static/**/*': "**/*",
      },
      livereload: true
    });
}

require("./core.js")({ before });
var gulp = require("gulp"),
  clean = require("gulp-clean"),
  shell = require("gulp-shell"),
  stylus = require("gulp-stylus"),
  fs = require('fs');

var cleanup = () => {
  return gulp
    .src(["build", "modules/components/app.css"], {
      force: true,
      read: false,
      allowEmpty: true
    })
    .pipe(clean());
};

var stylbuild = () => {
  return gulp
    .src("assets/stylus/app.styl")
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(gulp.dest("modules/components/"));
};

var stylwatch = () => {
  return gulp.watch("assets/stylus/**", gulp.series(stylbuild));
};

var personal = (res) => {
  if (!fs.existsSync('build')){
    fs.mkdirSync('build');
  }

  // for github pages
  fs.writeFile('build/.nojekyll', '', res);

  // google site verification
  fs.writeFile('build/google9ab7bf08387cc375.html', 'google-site-verification: google9ab7bf08387cc375.html', res);
}

var xitybuild = gulp.series(stylbuild, personal, shell.task("eleventy")),
  xityserve = gulp.series(stylbuild, personal, shell.task("eleventy --serve")),
  watchall = gulp.parallel(stylwatch, xityserve);

gulp.task("serve", gulp.series(cleanup, watchall));
gulp.task("default", gulp.series(cleanup, xitybuild));

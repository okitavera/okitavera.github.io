import fs from "fs";
import gulp from "gulp";
import babel from "gulp-babel";
import clean from "gulp-clean";
import shell from "gulp-shell";
import stylus from "gulp-stylus";

// google site verification
const ghash = "google9ab7bf08387cc375";

const cleanup = () =>
  gulp
    .src(["build", "modules/comps/app.css"], {
      force: true,
      read: false,
      allowEmpty: true
    })
    .pipe(clean());

const stylusbuild = () =>
  gulp
    .src("assets/stylus/app.styl")
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(gulp.dest("modules/comps/"));

const styluswatch = () =>
  gulp.watch("assets/stylus/**", gulp.parallel(stylusbuild));

const extasset = (repo, file) =>
  gulp.src(`node_modules/${repo}/${file}`).pipe(gulp.dest("build/assets/js"));

const assets = (done) => {
  extasset("vanilla-lazyload", "dist/**");
  extasset("smooth-scroll", "dist/**");
  gulp
    .src("assets/js/**")
    .pipe(babel())
    .pipe(gulp.dest("build/assets/js"));
  return done();
};

const personal = (done) => {
  !fs.existsSync("build") && fs.mkdirSync("build");
  // for github pages
  fs.writeFile("build/.nojekyll", "", done);
  fs.writeFile(
    `build/${ghash}.html`,
    `google-site-verification: ${ghash}.html`,
    done
  );
};

const prepareAssets = gulp.parallel(stylusbuild, personal, assets);

gulp.task(
  "serve",
  gulp.parallel(
    styluswatch,
    gulp.series(cleanup, prepareAssets, shell.task("eleventy --serve"))
  )
);

gulp.task(
  "default",
  gulp.series(cleanup, prepareAssets, shell.task("eleventy"))
);

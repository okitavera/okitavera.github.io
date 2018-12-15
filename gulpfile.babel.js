import fs from "fs";
import {spawn} from "child_process";
import gulp from "gulp";
import babel from "gulp-babel";
import clean from "gulp-clean";
import stylus from "gulp-stylus";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import mqpacker from "css-mqpacker";

// google site verification
const ghash = "google9ab7bf08387cc375";

const cleanup = () =>
  gulp
    .src(["build", "modules/comps/Illuminate.css"], {
      force: true,
      read: false,
      allowEmpty: true
    })
    .pipe(clean());

const stylusbuild = () =>
  gulp
    .src("assets/stylus/Illuminate.styl")
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(postcss([autoprefixer, cssnano, mqpacker]))
    .pipe(gulp.dest("modules/comps/"));

const styluswatch = () => gulp.watch("assets/stylus/**", stylusbuild);

const extasset = (repo, file) =>
  gulp.src(`node_modules/${repo}/${file}`).pipe(gulp.dest("build/assets/js"));

const assets = (done) => {
  extasset("vanilla-lazyload", "dist/**");
  extasset("smooth-scroll", "dist/**");
  return done();
};

const nextjs = () =>
  gulp
    .src("assets/js/**")
    .pipe(babel())
    .pipe(gulp.dest("build/assets/js"));

const nextjswatch = () => gulp.watch("assets/js/**", nextjs);

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

const prepareAssets = gulp.parallel(stylusbuild, personal, assets, nextjs);

const eleventy = (options = "") => {
  let cmd = (done) =>
    spawn("eleventy", options.split(), {stdio: "inherit"}).on("close", (code) =>
      done(code)
    );
  cmd.displayName = "eleventy" + options;
  return cmd;
};

gulp.task(
  "serve",
  gulp.series(
    cleanup,
    prepareAssets,
    gulp.parallel(styluswatch, nextjswatch, eleventy("--serve"))
  )
);

gulp.task("default", gulp.series(cleanup, prepareAssets, eleventy()));

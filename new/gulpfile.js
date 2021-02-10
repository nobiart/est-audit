"use strict"

// Load plugins
const gulp = require("gulp");
const {src, dest} = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
//const sourcemaps = require('gulp-sourcemaps');
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const groupMq = require("gulp-group-css-media-queries");
const del = require("del");
const fileinclude = require("gulp-file-include");
const browsersync = require("browser-sync").create();

// Paths
const path = {
    public: {
        html: 	"public/",
        js: 	"public/js/",
        css: 	"public/css/",
        images: "public/img/"
    },
    source: {
        html: 	"src/html/index.html",
        js: 	"src/js/*.js",
        css: 	"src/sass/style.scss",
        images: "src/img/**/*.{jpg,png,gif,svg}"
    },
    watch: {
        html: 	"src/html/**/*.html",
        js: 	"src/js/**/*.js",
        css: 	"src/sass/**/*.scss",
        images: "src/img/**/*.{jpg,png,gif,svg}"
    },
    clean: 		"./public"
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./public"
        },
        port: 7000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean public folder
function clean() {
    return del(path.clean);
}

// CSS task
function css() {
    return src(path.source.css, {
        base: "src/sass/"
    })
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(groupMq())
        .pipe(removeComments())
        //.pipe(sourcemaps.write("./", {addComment: false}))
        //.pipe(dest(path.public.css))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(path.public.css))
        .pipe(browsersync.stream());
}

// JavaScript task
function js() {
    return src(path.source.js, {
        base: "src/js/"
    })
        .pipe(plumber())
        //.pipe(rigger())
        .pipe(dest(path.public.js))
        //.pipe(uglify())
        /*.pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))*/
        .pipe(dest(path.public.js))
        .pipe(browsersync.stream());
}

// HTML task
function html() {
    return src(path.source.html, {
        base: "src/html"
    })
        .pipe(plumber())
        .pipe(newer(path.public.html))
        .pipe(fileinclude({
            prefix: "@@"
        }))
        .pipe(dest(path.public.html))
        .pipe(browsersync.stream());
}

// Images task
function images() {
    return src(path.source.images)
        .pipe(newer(path.public.images))
        .pipe(imagemin())
        .pipe(dest(path.public.images));
}

// Watch files
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(watchFiles, browserSync);


// Exports Tasks
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;

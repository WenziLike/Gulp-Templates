/*
Как  запустить новый проект на основе этой сборки
копируем Src , GulpFile.js , pack.json в новый проект
добаляем новый проект файлы и открываем в редакторе
в  терминале  должен быть путь в  этой папке
и вводим команду  npm i и Enter
//==================================
1 минимизациия иконок  командой  gulp svgmin
2 подключение  иконочного шрифта в  шаблон gulp iconfont
3 при запуске командой gulp в файле fonts пропишуться шрифты
 (стоит только указать адекватное название шрифтов) и 
 насыщенность шрифта.
100 - thin
300 - lite
400 - normal
500 - medium
600 - semibold
700 - bold
900 - black
*/
//========================================================
let projectFolder = require("path").basename(__dirname);
let sourceFolder = "src";

//================================
let fs = require('fs');
const { doesNotMatch } = require("assert");

//========================================================
// TODO пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
        video: projectFolder + "/video/",
        PHPmailer: projectFolder + "/phpmailer",
        PHPfile: projectFolder + "/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{JPEG,jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
        video: sourceFolder + "/video/**/*",
        PHPmailer: sourceFolder + "/phpmailer/**/*",
        PHPfile: sourceFolder + "/*.php",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{JPEG,jpg,png,svg,gif,ico,webp}",
        video: sourceFolder + "/video/**/*",
        PHPmailer: sourceFolder + "/phpmailer/**/*",
        PHPfile: sourceFolder + "/**/*.php",

    },
    clean: "./" + projectFolder + "/"
}


//========================================================
// обьявление переменных
let { src, dest } = require("gulp"), //подключаем Gulp
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(), // сервер для работы и автоматического обновления страниц
    fileinclude = require("gulp-file-include"),
    del = require("del"), // плагин для удаления файлов и каталогов
    scss = require("gulp-sass"), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require("gulp-autoprefixer"), // модуль для автоматической установки автопрефиксов
    group_media = require("gulp-group-css-media-queries"), // модуль для сбора всех разбросанных медиа запросов по коду
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default, // модуль минимизации JS
    imagemin = require("gulp-imagemin"), // модуль минимизации картинки 
    webp = require("gulp-webp"), // модуль для нового формата картинки Webp
    webphtml = require("gulp-webp-html"), // модуль добавления html кода Webp картинки
    webpcss = require("gulp-webpcss"), // модуль добавления Webp класса в файл стиля
    svgSprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"), // 2 модуля  обработки шрифтов ttf и ttf2
    ttf2woff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter"), // модуль обработки Otf формат шрифтов
    sourceMaps = require("gulp-sourcemaps"),
    svgmin = require('gulp-svgmin'), //минимизирует Svg формат
    iconfont = require('gulp-iconfont'), //иконки шрифтов
    iconfontCss = require('gulp-iconfont-css');

//========================================================
/* настройки сервера */
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        notify: false
    });
}
//========================================================
// сбор html
function html() {
    return src(path.src.html)
        .pipe(sourceMaps.init())
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(sourceMaps.write('.'))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}
// сбор стилей
function css() {
    return src(path.src.css)
        .pipe(sourceMaps.init())
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(sourceMaps.write('.'))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}
// сбор JavaScript
function js() {
    return src(path.src.js)
        .pipe(sourceMaps.init())
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(sourceMaps.write('.'))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}
// сбор IMG и WebP
function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimization: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}
//========================================================
//функция  обработки шрифтов
function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}
//========================================================
//функция  обработки видео копирывание в  папочку DIST
function video() {
    return src(path.src.video)
        .pipe(dest(path.build.video))
        .pipe(browsersync.stream());
}
//========================================================
// PHP mailer  отправка заявки на почту
function phpMailer() {
    return src(path.src.PHPmailer)
        .pipe(dest(path.build.PHPmailer))
        .pipe(browsersync.stream());
}
//функция  обработки PHP files
function PHPfile() {
    return src(path.src.PHPfile)
        .pipe(dest(path.build.PHPfile))
        .pipe(browsersync.stream());
}

//========================================================
// функция  обработки из OTF в TTF формат
// !для вызова функции обработки в терминале gulp otf2ttf
gulp.task('otf2ttf', function () {
    return src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/')); // не ложит в  папку Fonts
});
//========================================================
// обработка иконок
gulp.task('svgmin', function () {
    return src([sourceFolder + '/img/icons/**/*']) //*.svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(dest('src/img/icons/'));
});

var runTimestamp = Math.round(Date.now() / 1000);

var fontName = 'MyIcons';

gulp.task('iconfont', function () {
    return gulp.src(['src/img/icons/*.svg']) // Исходная папка, содержащая изображения SVG
        .pipe(iconfontCss({
            fontName: fontName, // Имя, которое будет иметь сгенерированный шрифт
            path: 'src/scss/#icons_fontsShab.scss', // Путь к шаблону, который будет использоваться для создания файла SASS / LESS / CSS
            targetPath: '../../src/scss/icons_fonts.scss', // Путь, где будет создан файл
            fontPath: '../../fonts/' // Путь к файлу шрифта иконки
        }))
        .pipe(iconfont({
            prependUnicode: false, // Рекомендуемая опция 
            fontName: fontName, // Название шрифта
            formats: ['ttf', 'eot', 'woff', 'woff2'], // Форматы файлов шрифтов, которые будут созданы
            normalize: true,
            timestamp: runTimestamp // Рекомендуется для получения согласованных сборок при просмотре файлов
        }))
        .pipe(gulp.dest('src/fonts/'));
});



//========================================================
//функция записи подключения  шрифтов к файлам стилей
function fontsStyle(params) {
    let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        });
    }
}
// CALLBACK функция
function cb() {

}
//========================================================
// TODO функция за слежка за файлами чтобы  обновлялся  браузер
// запуск задач при изменении файлов
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.PHPfile], PHPfile);
}
//========================================================
// функция очистки лишних файлов конечной папки Dist;
function clean() {
    return del(path.clean);
}

//========================================================
// TODO переменная для выполнения функции
let build = gulp.series(clean, gulp.parallel(PHPfile, phpMailer, video, js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

//========================================================
// задаем слияние с GULP простыми словами делаем видимым 
exports.PHPfile = PHPfile;
exports.phpMailer = phpMailer;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.video = video;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
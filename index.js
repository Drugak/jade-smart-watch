/**
 * Created by admin on 02.02.16.
 */
gulp.task('watch-jade', function () {


    var watchObj,
        srcTmpl = [
            "../frontend/assets/tmpl/pages/*.jade",
            "../frontend/assets/tmpl/directives/*.jade",
            "../frontend/assets/tmpl/modals/*.jade",
            "../frontend/assets/tmpl/includes/*.jade",
            "../frontend/assets/tmpl/mixins/*.jade"
        ];


    function start() {
        watchObj = watch(srcTmpl, {verbose: true, events: ['change']});

        watchObj.on('change' , function(e){
            if(e.indexOf('mixins') >= 0 || e.indexOf('includes') >= 0) {
                mixin(this);
            } else {
                template(this);
            }
        });
    }

    var mixin  = function (me){
        console.log("this is mixin");
        runSequence('jade');
        me.pipe(
            notify({
                message: "Generated all JADE files .... Pleas whait !"
            })
        );
        offWatch();
    };

    var template = function (me){
        console.log("this page or directives");
        me.pipe(plumber({errorHandler: onError}))
            .pipe(affected())
            .pipe(jade())
            .pipe(rename(function(path) {
                path.basename += '.min';
                path.extname = ".html";
            }))
            .pipe(notify({
                message: "Generated the best for all the time file: <%= file.relative %>"
            }))
            .pipe(gulp.dest('../webapp/assets/tmpl'));
        offWatch();
    };

    function offWatch () {
        watchObj.unwatch(srcTmpl);
        start();
    };

    start();
});
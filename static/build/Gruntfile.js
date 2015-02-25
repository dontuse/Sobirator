module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        concat: {
            dist: {
                src: grunt.file.readJSON('js.json'),
                dest: '../publish/script.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    '../publish/script.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        less: {
            dev: {
                options: {},
                files: {
                    "../publish/style.css": "../blocks/sobirator.less"
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    "../publish/style.css": "../blocks/sobirator.less"
                }
            }
        },
        watch: {
            options: {
                atBegin: true,
                livereload: true
            },
            scripts: {
                files: ['<%= concat.dist.src %>', 'js.js'],
                tasks: 'concat'
            },
            css: {
                files: [
                    '../blocks/**/*.less',
                    '../blocks/*.less'
                ],
                tasks: 'less:dev'

            },
            pages: {
                files: ['' +
                '../pages/**/*.hbs',
                    '../parts/**/*.hbs',
                    '../layouts/**/*.hbs',
                    '../blocks/**/*.hbs',
                    '../data/**/*.json'
                ],
                tasks: 'assemble'
            }
        },
        imageEmbed: {
            dist: {
                src: ['../publish/style.css'],
                dest: '../publish/style.css',
                options: {
                    deleteAfterEncoding: false
                }
            }
        },
        assemble: {
            options: {
                data: ['../data/*.json'],
                layoutdir: '../layouts',
                layout: 'main.hbs',
                tmpPath: 'html/tmp/',
                blockPath: 'html/block',
                stylePath: 'html/publish',
                jsPath: 'html/js',
                partials: ['../parts/**/*.hbs', '../blocks/**/*.hbs'],
                // data: ['../data/*.{json,yml}'],
                flatten: true
            },
            pages: {
                src: ['../pages/*.hbs'],
                dest: '../..'
            }
        },
        // internal server
        connect: {
            server: {
                options: {
                    livereload: true,
                    base: '../../',
                    middleware: function (connect, options, middlewares) {
                        // inject a custom middleware into the array of default middlewares
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                            res.setHeader('Access-Control-Allow-Headers', '*');

                            var fs = require('fs');
                            var path = require('path');
                            var support = ['POST', 'PUT', 'DELETE'];

                                if (support.indexOf(req.method.toUpperCase()) != -1) {
                                    var filepath = path.join(options.base[0], req.url);
                                    if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                                        return res.end(fs.readFileSync(filepath));
                                    }
                                }

                                return next();

                            });

                            return middlewares;
                        }
                    }
                }
            },
            autoprefixer: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9']
                },
                dist: {
                    src: ['../publish/style.css'],
                    dest: '../publish/style.css'
                }
            },
            copy: {
                main: {
                    src: '../js/',
                    dest: 'create-me'
                }
            }
        });


    grunt.loadNpmTasks('grunt-contrib-concat');    // конкатит файлы
    grunt.loadNpmTasks('grunt-contrib-less');     // компилит less / жмет
    grunt.loadNpmTasks('grunt-contrib-uglify');  // жмет js
    grunt.loadNpmTasks('grunt-contrib-watch');  // вотчер
    grunt.loadNpmTasks("grunt-image-embed");   // конвертит картинке в base64
    grunt.loadNpmTasks('assemble');           // сборка html
    grunt.loadNpmTasks('grunt-contrib-connect');  // сервер
    grunt.loadNpmTasks('grunt-autoprefixer');


    // main dev task
    grunt.registerTask('default', ['concat', 'less:dev', 'assemble', 'autoprefixer']);

    // server
    grunt.registerTask('server', ['connect', 'watch']);

    // production
    grunt.registerTask('prod', ['concat', 'uglify', 'less:production', 'imageEmbed', 'autoprefixer']);


};
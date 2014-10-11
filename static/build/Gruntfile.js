

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        concat: {
            dist: {
                src:  grunt.file.readJSON('js.json'),
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
                options: {
                },
                files: {
                    "../publish/style.css": "../blocks/love.less"
                }
            },
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    "../publish/style.css": "../blocks/love.less"
                }
            }
        },
        watch: {
            options: {
                atBegin: true,
                livereload: true
            },
            scripts: {
                files: ['<%= concat.dist.src %>','js.js'],
                tasks: 'concat'
            },
            css: {
                files: [
                    '../blocks/**/*.less',
                    '../blocks/*.less'
                ],
                tasks: 'less:dev'

            },
            pages : {
                files: ['../pages/**/*.hbs' , '../parts/**/*.hbs', '../layouts/**/*.hbs' ],
                tasks: 'assemble'
            }
        },
        imageEmbed: {
            dist: {
                src: ['../publish/style.css'],
                dest: '../publish/style.css',
                options: {
                    deleteAfterEncoding : false
                }
            }
        },
        assemble: {
            options: {
                data: ['../data/*.json'],
                layoutdir: '../layouts',
                layout: 'main.hbs',
                tmpPath : 'html/tmp/',
                blockPath : 'html/block',
                stylePath : 'html/publish',
                jsPath : 'html/js',
                partials: ['../parts/**/*.hbs' , '../blocks/**/*.hbs' ],
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
                    base: '../../'
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
    grunt.registerTask('default', [ 'concat' , 'less:dev' , 'assemble' , 'autoprefixer' ]);

    // server
    grunt.registerTask('server', ['connect', 'watch']);

    // production
    grunt.registerTask('prod', ['concat', 'uglify' , 'less:production' , 'imageEmbed' , 'autoprefixer'] );




};
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readYAML('./config.yml'),
        theme: 'themes/<%= config.theme %>',

        assemble: {
            options: {
                flatten: true,
                data: 'config.yml',
                prettify: {
                    indent: 2,
                    condense: true,
                    newlines: true
                },
                assets: '_demo/assets',
                helpers: 'helpers/*.js',
                partials: ['<%= theme %>/includes/*.hbs'],
                layoutdir: '<%= theme %>/layouts',
                layout: 'default.hbs',

                plugins: [
                    'assemble-middleware-rss',
                    'assemble-middleware-sitemap'
                ],

                rss: {
                    title: 'Wave Developers',
                    description: 'Events, Videos, Presentations.'
                },

                sitemap: {
                    dest: '<%= config.site.build %>',
                    homepage: '<%= config.site.url %>',
                    relativedest: '<%= config.site.build %>',
                    changefreq: 'dayly'
                }
            },
            site: {
                files: [
                    {
                        '<%= config.site.build %>/events/': ['events/*.hbs']
                    },
                    {
                        '<%= config.site.build %>/': ['pages/*.hbs']
                    }
                ]
            }
        },
        bump: {
            options: {
                pushTo: 'origin'
            }
        },
        clean: {
            dist: [
                '<%= config.site.build %>'
            ]
        },
        copy: {
            events: {
                files: [
                    {
                        expand: true,
                        cwd: 'events',
                        src: ['*.jpg', '*.png'],
                        dest: '<%= config.site.build %>/events/'
                    },
                    {
                        expand: true,
                        src: ['assets/images/**/*.jpg', 'assets/images/**/*.png'],
                        dest: '<%= config.site.build %>'
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                branch: 'master',
                tag: '<%= pkg.version %>',
                repo: 'git@github.com:wave-developers/wave-developers.github.io.git'
            },
            src: ['**']
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    '<%= config.site.build %>/css/main.css': '<%= theme %>/less/*.less'
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    '<%= config.site.build %>/css/main.min.css': '<%= theme %>/less/*.less'
                }
            }
        },
        watch: {
            all: {
                files: [
                    'config.yaml',
                    'Gruntfile.js',
                    'pages/**/*',
                    'events/**/*',
                    'themes/**/*'
                ],
                tasks: ['build'],
                options: {
                    livereload: true,
                    reload: true,
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('build', ['clean', 'assemble', 'less', 'copy']);
    grunt.registerTask('publish', ['build', 'gh-pages']);
    grunt.registerTask('default', ['build', 'watch']);
};
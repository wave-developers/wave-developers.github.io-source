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
                layout: 'default.hbs'
            },
            'wave-developers': {
                files: [
                    { '<%= config.site.build %>/': ['pages/*.hbs'] },
                    { expand: true, src: ['posts/*.md'], dest: '<%= config.site.build %>/'}
                ]
            }
        },
        bump: {
            options: {
                pushTo: 'origin'
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
        watch: {
            all: {
                files: [
                    'pages/**/*',
                    'posts/**/*',
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('build', ['assemble']);
    grunt.registerTask('publish', ['build', 'gh-pages']);
    grunt.registerTask('default', ['build', 'watch']);
};
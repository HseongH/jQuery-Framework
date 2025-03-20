module.exports = function (grunt) {
  "use strict";

  require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    connect: {
      server: {
        options: {
          port: 80,
          hostname: "*",
          keepalive: true,
          open: true,
          base: ".",
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(
              require("grunt-middleware-proxy/lib/Utils").getProxyMiddleware()
            );
            middlewares.unshift(
              require("connect-modrewrite")({
                from: "^/mad/(.*)$",
                to: "/mad/src/pages/$1",
              })
            );
            return middlewares;
          },
        },
        proxies: [
          "/api",
          "/auth-user",
          "/auth-admin",
          "/auth-check",
          "/auth-sche",
          "/sso",
          "/dwr",
          "/logout",
          "/oauth2",
          "/login",
          "/auth-editor",
          "/engine-search-api",
          "/engine-snow",
        ].reduce(function (contexts, context) {
          return contexts.concat({
            context: context,
            host: process.env.API_URL,
            port: 13131,
            https: false,
            rewriteHost: false,
          });
        }, []),
      },
    },

    watch: {
      files: ["common/**/*", "mad/src/**/*"],
      tasks: ["server"],
      options: {
        livereload: true,
      },
    },

    clean: {
      build: ["dist/mad"],
    },

    processhtml: {
      dist: {
        files: {
          "dist/mad/index.html": ["index.html"],
        },
      },
    },

    sass: {
      options: {
        implementation: require("sass"),
        sourceMap: true,
      },
      dist: {
        files: {
          "mad/src/styles/style.css": [
            "common/styles/application.scss",
            "mad/src/**/*.scss",
          ],
        },
      },
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: ".",
          mainConfigFile: "requirejs.config.js",
          name: "almond",
          include: ["mad/src/index"],
          out: "dist/mad/index.js",
          optimize: "uglify2",
          findNestedDependencies: true,
          wrap: true,
        },
      },
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /\/common\//g,
              replacement: "./",
            },
          ],
        },
        files: [
          {
            expand: true,
            cwd: "mad/src/styles/",
            src: ["style.css"],
            dest: "dist/mad/assets",
          },
        ],
      },
    },

    concat: {
      js: {
        src: ["dist/mad/index.js", "common/js/**/*.js", "mad/src/**/*.js"],
        dest: "dist/mad/assets/index.js",
      },
      css: {
        src: ["dist/mad/assets/style.css", "mad/src/**/*.css"],
        dest: "dist/mad/assets/style.css",
      },
    },

    cssmin: {
      main: {
        src: "dist/mad/assets/style.css",
        dest: "dist/mad/assets/style.min.css",
      },
    },

    imagemin: {
      main: {
        files: [
          {
            expand: true,
            cwd: "common/images",
            src: ["**/*.{png,jpg,gif}"],
            dest: "dist/mad/assets/images",
          },
        ],
      },
    },

    uglify: {
      main: {
        src: "dist/mad/assets/index.js",
        dest: "dist/mad/assets/index.min.js",
      },
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "common/fonts",
            src: "**",
            dest: "dist/mad/assets/fonts",
          },
          {
            expand: true,
            cwd: "common/template",
            src: "**",
            dest: "dist/mad/assets/template",
          },
        ],
      },
    },

    compress: {
      main: {
        options: {
          archive: "mad.zip",
        },
        files: [{ expand: true, cwd: "dist/mad/", src: "**" }],
      },
    },
  });

  // Load Grunt plugins
  grunt.loadNpmTasks("grunt-middleware-proxy");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-processhtml");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-compress");

  // Define tasks
  grunt.registerTask("server", [
    "setupProxies:server",
    "connect:server",
    "watch",
  ]);
  grunt.registerTask("build", [
    "clean",
    "processhtml",
    "sass",
    "requirejs",
    "replace",
    "concat",
    "cssmin",
    "imagemin",
    "uglify",
    "copy",
    "compress",
  ]);
  grunt.registerTask("default", ["build", "server"]);
};

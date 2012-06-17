module.exports = function(build) {
	// set basic info about the repo
	build.setNameVersion("classify", "0.9.8");

	// set the url of this repo
	build.setRepoName("https://github.com/weikinhuang/Classify");

	// adds a list of files that will be parsed
	build.addSourceFile("core.js", "create.js", "mutator.static.js", "mutator.nowrap.js", "mutator.alias.js", "mutator.bind.js", "observer.js", "mutator.observable.js", "namespace.js", "export.js");

	// adds a list of unit tests files that will be run
	build.addUnitTestFile("core.js", "create.js", "mutator.static.js", "mutator.nowrap.js", "mutator.alias.js", "mutator.bind.js", "observer.js", "mutator.observable.js", "namespace.js", "export.js");

	// adds a list of benchmark tests that will be run
	build.addBenchmarkFile("create.js");

	// adds any dependencies that are required
	build.addExternalFile();

	// adds any copy, headers, footers to the js file
	build.addCopyright("copyright.js");
	build.addSourceWrap("wrap.js");

	// sets the list of environments that this code can run against
	build.enableEnvironment("node", "web");

	// set the default set of tasks that should be run by default when called with no build args
	build.setDefaultTasks("lint", "unit", "size", "clean", "concat", "min");

	// set linting options
	build.addTaskOptions("lint", {
		// run the linter on a per file basis
		perFile : false,
		// the options to run the linter with
		options : {
			latedef : true,
			noempty : true,
			undef : true,
			strict : true,
			node : true,
			browser : true,
			predef : []
		}
	});

	// set uglify minification options
	build.addTaskOptions("min", {
		strict_semicolons : false,
		unsafe : true,
		lift_vars : false,
		consolidate : false,
		mangle : {
			toplevel : false,
			defines : {},
			except : [],
			no_functions : false
		},
		squeeze : {
			make_seqs : true,
			dead_code : true
		},
		generate : {
			ascii_only : false,
			beautify : false,
			indent_level : 4,
			indent_start : 0,
			quote_keys : false,
			space_colon : false,
			inline_script : false
		},
		// function to run to modify any code before the minification process
		preparse : function(src) {
			// Previously done in sed but reimplemented here due to portability issues
			src = src.replace(/^(\s*\*\/)(.+)/m, "$1\n$2");

			var proto = (/(\w+)\s*=\s*"prototype"/).exec(src);
			if (proto) {
				src = src.replace(/\.prototype\b/g, "[" + proto[1] + "]");
			}

			return src;
		}
	});

	// set options for the documentation generator
	build.addTaskOptions("doc", {
		markdown : "README",
		html : "classifyjs.com",
		files : [ "classify.docs.js" ]
	});

	// set options for the package file generator
	build.addTaskOptions("pkg", {
		file : "package.json",
		desc : {
			name : "classifyjs",
			description : "Classify.js is a library that allows for cross platform and cross browser Object Oriented Javascript class definitions using classical inheritance and namespaces behind the prototype syntax in an easy to use interface function.",
			keywords : [ "util", "functional", "server", "client", "browser", "prototype", "object-oriented", "class", "classes", "inheritance", "abstraction" ],
			author : "Wei Kin Huang <wei@closedinterval.com>",
			version : "@VERSION",
			homepage : "http://classifyjs.com",
			repository : {
				type : "git",
				url : "https://github.com/weikinhuang/Classify.git"
			},
			bugs : {
				url : "https://github.com/weikinhuang/Classify/issues"
			},
			licenses : [ {
				type : "MIT",
				url : "https://github.com/weikinhuang/Classify/blob/master/MIT-LICENSE.txt"
			} ],
			main : "dist/classify"
		}
	});

	// set the options for running unit tests against browserstack
	build.addTaskOptions("browserstack", {
		browsers : [
		            // win - ie
		            { browser : "ie", version : "7.0", os : "win" },
		            { browser : "ie", version : "8.0", os : "win" },
		            { browser : "ie", version : "9.0", os : "win" },
		            { browser : "ie", version : "10.0", os : "win" },
		            // win - chrome
		            { browser : "chrome", version : "19.0", os : "win" },
		            // win - firefox
		            { browser : "firefox", version : "10.0", os : "win"	},
		            { browser : "firefox", version : "10.0", os : "win"	},
		            { browser : "firefox", version : "10.0", os : "win"	}
		            ]
	});
};

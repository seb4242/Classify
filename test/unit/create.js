module("create");

test("simple class creation", function() {
	var test = Create({
		a : 1,
		b : function() {
			return this.a;
		},
		c : function() {
			return this.b();
		},
		toString : function() {
			return "a";
		},
		valueOf : function() {
			return 2;
		}
	});

	equals(typeof test, "function", "defined class is an object");
	equals(typeof new test(), "object", "instantiated class is an object");
	equals(new test().a, 1, "member variable is as defined");
	equals(new test().b(), 1, "call to member variable within context");
	equals(new test().c(), 1, "call to member function within context");

	// valueOf is always called ahead of toString when it is defined
	equals(new test() + "", "2", "implicit toString() called explicitly");
	equals((new test()).toString(), "a", "explicit toString() called explicitly");
	equals(+new test(), 2, "implicit valueOf() called explicitly");
	equals((new test()).valueOf(), 2, "explicit valueOf() called explicitly");
});

test("invocation and constructors", function() {
	// testing class creation without a constructor
	var test = Create({
		a : 1,
		b : function() {
			return this.a;
		}
	});
	equals(typeof new test(), "object", "instantiated class with no constructor is an object");
	ok(new test() instanceof test, "instantiated class with no constructor is an an proper instance");
	equals(new test().b(), 1, "call to member variable within context with no constructor");

	// testing class creation with a basic constructor
	test = Create({
		a : 1,
		_construct_ : function() {
			this.a = 2;
		},
		b : function() {
			return this.a;
		}
	});
	// testing class creation with a basic constructor
	equals(typeof new test(), "object", "instantiated class with basic constructor is an object");
	ok(new test() instanceof test, "instantiated class with basic constructor is an an proper instance");
	equals(new test().b(), 2, "call to member variable within context with basic constructor");

	// test creating a constructor with parameters
	test = Create({
		a : 1,
		_construct_ : function(a) {
			this.a = a;
		},
		b : function() {
			return this.a;
		}
	});
	// testing class creation with a basic constructor
	equals(typeof new test(3), "object", "instantiated class with simple constructor is an object");
	ok(new test(3) instanceof test, "instantiated class with simple constructor is an an proper instance");
	equals(new test(3).b(), 3, "call to member variable within context with simple constructor");

	// test creating a instances with invocation
	test = Create({
		a : 1,
		_construct_ : function(a) {
			this.a = a;
		},
		b : function() {
			return this.a;
		}
	});
	// testing class creation with a basic constructor
	equals(typeof test(3), "object", "instantiated class invocation is an object");
	ok(test(3) instanceof test, "instantiated class with invocation is an an proper instance");
	equals(test(3).b(), 3, "call to member variable within context with invocation");

	// test overriding invocation function to not generate a class instance
	test = Create({
		a : 1,
		_invoke_ : function() {
			return "x";
		},
		_construct_ : function(a) {
			this.a = a;
		}
	});
	equals(test(), "x", "override invocation functionality to execute functionality");
});

test("known properties", function() {
	// testing class for known properties in every defined class
	var test = Create({});

	equals(test.__isclass_, true, "flag indicating this object was created using the Create method");
	equals((new test()).constructor, test, "assert that we have a internal reference to the constructor via 'constructor'");
	equals((new test())._self_, test, "assert that we have a internal reference to the constructor via '_self_'");
	equals(typeof test.superclass, "function", "assert that there is an internal reference to the parent class");
	equals(test.superclass, base, "assert that the reference to the superclass is the parent");
	equals(typeof test.subclass, "object", "assert that an array is created holding child classes");
	equals(test.subclass.length, 0, "assert that there are no child classes extending this object");
	ok(new test() instanceof test, "assert that a new object of this class is an instance of it's constructor");
	ok(new test() instanceof base, "assert that a new object of this class is an instance of it's parent");
});

test("static properties", function() {
	// testing class creation with static properties
	var test = Create({
		a : 1,
		__static_a : 2,
		b : function() {
			return this.a;
		},
		__static_b : function() {
			// the internal "this" reference should always point to the class definition in a static context
			return this.a;
		},
		c : function() {
			return test.a;
		},
		d : function() {
			return this._self_;
		},
		e : function() {
			return this._self_.a;
		}
	});

	equals(test.a, 2, "Reading static property of an class");
	equals((new test()).a, 1, "Reading non static property of an class");
	equals(test.b(), 2, "Invoking static function of a class");
	equals((new test()).b(), 1, "Invoking dynamic function of a class");
	equals((new test()).c(), 2, "Reading static property by name within a class");
	equals((new test()).d(), test, "Reading static definition within a class");
	equals((new test()).e(), 2, "Reading static property by using _self_ within a class");
});

test("adding new properties", function() {
	// testing class for known properties in every defined class
	var test = Create({});

	// adding properties to the prototype
	test.prototype.b = function() {
		return 1;
	};
	equals((new test()).b(), 1, "invoking a method added using prototype method");
	test.addProperty("c", function() {
		return 1;
	});
	equals((new test()).c(), 1, "invoking a method added using addProperty method");

	// adding properties to the object
	test.b = function() {
		return 1;
	};
	equals(test.b(), 1, "invoking a method added using classical method");
	test.addStaticProperty("c", function() {
		return 1;
	});
	equals(test.c(), 1, "invoking a method added using addStaticProperty method");

	// test that references is proper
	test.addStaticProperty("d", function() {
		equals(this, test, "assuring the 'this' reference of a method added using addStaticProperty method is the constructor");
		return 1;
	});
	test.c();
});

test("extending classes using inheritance", function() {
	// testing class for known properties in every defined class
	var test = Create({
		a : function() {
			return 1;
		},
		b : function() {
			return 2;
		},
		d : function() {
			return 4;
		},
		e : function() {
			return this.constructor;
		}
	});
	var subclass = Create(test, {
		c : function() {
			return 3;
		},
		d : function() {
			return this._parent_();
		},
		f : function() {
			return this.constructor;
		}
	});
	var subclass_a = Create(test, {
		b : function() {
			// invoking the parent version of this function
			return this._parent_() + 4;
		}
	});
	var subsubclass = Create(subclass, {
		c : function() {
			return 4;
		},
		d : function() {
			return this._parent_();
		},
		e : function() {
			return this._parent_();
		}
	});

	// test instance inheritance functionality
	ok((new test()) instanceof test, "assert that instantiated classes are instances of itself");
	ok((new subclass()) instanceof test, "assert that inherited classes are instances of it's parent");
	ok((new subsubclass()) instanceof test, "assert that inherited classes are instances of it's parent (multi level)");
	ok((new subsubclass()) instanceof subclass, "assert that inherited classes are instances of it's parent (single level)");

	// test prototype inheritance functionality
	equals((new subclass()).a(), 1, "inherited function in child class is executed");
	equals((new subclass()).c(), 3, "new function in child class is executed");
	equals((new subsubclass()).c(), 4, "overriden function in child class is executed");

	// test 'this' reference integrity
	equals((new subclass()).e(), subclass, "reference to this within inherited function is to itself");

	// test calling parent functions
	equals((new subclass()).d(), 4, "parent method in overriden method is executed");
	equals((new subclass_a()).b(), 6, "parent method in overriden method is executed with additional logic");
	equals((new subsubclass()).d(), 4, "parent method in overriden method is executed (multi level)");
	equals((new subsubclass()).e(), subsubclass, "parent method's 'this' is still referencing proper object");

	// testing inherited properties
});

// implements
var assert = require("assert");
var Terser = require("../..");

describe("parentheses", function() {
    it("Should add trailing parentheses for new expressions with zero arguments in beautify mode", function() {
        var tests = [
            "new x(1);",
            "new x;",
            "new new x;",
            "new (function(foo){this.foo=foo;})(1);",
            "new (function(foo){this.foo=foo;})();",
            "new (function test(foo){this.foo=foo;})(1);",
            "new (function test(foo){this.foo=foo;})();",
            "new true;",
            "new (0);",
            "new (!0);",
            "new (bar = function(foo) {this.foo=foo;})(123);",
            "new (bar = function(foo) {this.foo=foo;})();"
        ];
        var expected = [
            "new x(1);",
            "new x();",
            "new new x()();",
            "new function(foo) {\n    this.foo = foo;\n}(1);",
            "new function(foo) {\n    this.foo = foo;\n}();",
            "new function test(foo) {\n    this.foo = foo;\n}(1);",
            "new function test(foo) {\n    this.foo = foo;\n}();",
            "new true();",
            "new 0();",
            "new (!0)();",
            "new (bar = function(foo) {\n    this.foo = foo;\n})(123);",
            "new (bar = function(foo) {\n    this.foo = foo;\n})();"
        ];
        for (var i = 0; i < tests.length; i++) {
            assert.strictEqual(
                Terser.minify(tests[i], {
                    output: {beautify: true},
                    compress: false,
                    mangle: false
                }).code,
                expected[i]
            );
        }
    });

    it("Should not add trailing parentheses for new expressions with zero arguments in non-beautify mode", function() {
        var tests = [
            "new x(1);",
            "new x;",
            "new new x;",
            "new (function(foo){this.foo=foo;})(1);",
            "new (function(foo){this.foo=foo;})();",
            "new (function test(foo){this.foo=foo;})(1);",
            "new (function test(foo){this.foo=foo;})();",
            "new true;",
            "new (0);",
            "new (!0);",
            "new (bar = function(foo) {this.foo=foo;})(123);",
            "new (bar = function(foo) {this.foo=foo;})();"
        ];
        var expected = [
            "new x(1);",
            "new x;",
            "new(new x);",
            "new function(foo){this.foo=foo}(1);",
            "new function(foo){this.foo=foo};",
            "new function test(foo){this.foo=foo}(1);",
            "new function test(foo){this.foo=foo};",
            "new true;",
            "new 0;",
            "new(!0);",
            "new(bar=function(foo){this.foo=foo})(123);",
            "new(bar=function(foo){this.foo=foo});"
        ];
        for (var i = 0; i < tests.length; i++) {
            assert.strictEqual(
                Terser.minify(tests[i], {
                    output: {beautify: false},
                    compress: false,
                    mangle: false
                }).code,
                expected[i]
            );
        }
    });

    it("Should compress leading parenthesis with reasonable performance", function() {
        var code = [
            "({}?0:1)&&x();",
            "(function(){}).name;",
        ];
        for (var i = 9; --i >= 0;) {
            code = code.concat(code);
        }
        code = code.join("");
        var result = Terser.minify(code, {
            compress: false,
            mangle: false,
        });
    });
})

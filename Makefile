npmBin = node_modules/.bin
build = build
jqueryFinder = $(build)/jquery.finder.js

.PHONY: install clean test cover lint watch build build-finderjs build-jquery

install:
	rm -rf node_modules/
	npm install

clean:
	rm -rf coverage/
	rm -f example/bundle.js
	rm -rf build/

test:
	$(npmBin)/tape test/**/*.js | $(npmBin)/tap-spec

cover:
	$(npmBin)/istanbul cover --report html test/test.js

lint:
	$(npmBin)/eslint *.js test/**

watch:
	$(npmBin)/watchify $(in) -d -v -o $(out)

build: build-finderjs build-jquery

build-finderjs: clean
	$(npmBin)/browserify --no-builtins example/index.js -o example/bundle.js
	mkdir $(build)
	$(npmBin)/browserify --full-paths --no-builtins --s finder -g uglifyify index.js -o $(build)/finder.min.js

build-jquery: build-finderjs
	echo "/* " > $(jqueryFinder)
	cat LICENSE >> $(jqueryFinder)
	echo "\n*/\n" >> $(jqueryFinder)
	cat $(build)/finder.min.js >> $(jqueryFinder)
	echo "\n" >> $(jqueryFinder)
	cat jqueryWrapper.js >> $(jqueryFinder)

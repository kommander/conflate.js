VERSION = $(shell node -pe 'require("./package.json").version')

test:
	@./node_modules/.bin/mocha \
		--check-leaks \
		--reporter spec
.PHONY: test

specs:
	@echo 'Creating specs file from tests.'
	make test > specs
	@echo 'Done.'
.PHONY: specs

coverage:
	@node ./node_modules/istanbul/lib/cli.js cover \
	./node_modules/.bin/_mocha -- --recursive --reporter dot
.PHONY: coverage

report: coverage
	@echo 'Opening default browser with coverage report.'
	@open ./coverage/lcov-report/index.html

mincov: coverage
	@node ./node_modules/istanbul/lib/cli.js check-coverage --statements 90 --functions 90 --lines 90 --branches 90
.PHONY: mincov

setup:
	@echo "Installing Development dependencies."
	@NODE_ENV=development && npm install --no-shrinkwrap
.PHONY: setup

lint:
	@node ./node_modules/eslint/bin/eslint.js ./lib/**/*.js ./test/**/*.js
	@echo "ESLint done."
.PHONY: lint

hooks:
	@echo "Setting up git hooks."
	cp ./dev/module.pre-push.sh ./.git/hooks/pre-push
	chmod +x ./.git/hooks/pre-push
.PHONY: hooks

clean:
	@echo "Housekeeping..."
	rm -rf ./node_modules
	rm -rf ./coverage
	@echo "Clean."
.PHONY: clean

dev: clean setup hooks lint test coverage

release-patch: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "patch")')
release-minor: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "minor")')
release-major: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "major")')
prerelease-alpha: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "prerelease", "alpha")')
prerelease-beta: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "prerelease", "beta")')
prerelease-rc: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "prerelease", "rc")')
release-patch: release
release-minor: release
release-major: release
prerelease-alpha: release
prerelease-beta: release
prerelease-rc: release

release: mincov test specs
	@printf "Current version is $(VERSION). This will publish version $(NEXT_VERSION). Press [enter] to continue." >&2
	@read
	@node -e '\
		var j = require("./package.json");\
		j.version = "$(NEXT_VERSION)";\
		var s = JSON.stringify(j, null, 2);\
		require("fs").writeFileSync("./package.json", s);'
		@git commit package.json specs -m 'Version $(NEXT_VERSION)'
		@git tag -a "v$(NEXT_VERSION)" -m "Version $(NEXT_VERSION)"
	@git push --tags origin HEAD:master
	npm publish
.PHONY: release release-patch release-minor release-major

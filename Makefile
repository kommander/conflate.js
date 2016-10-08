test:
	@./node_modules/.bin/mocha \
		--check-leaks \
		--reporter dot
.PHONY: test

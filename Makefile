test:
	npm test

tag-pre:
	npm version prerelease

tag-patch:
	npm version patch

tag-minor:
	npm version minor

tag-major:
	npm version major

publish-pre:
	npm publish --tag pre --access public

publish:
	npm publish --access public

changelog:
	github_changelog_generator -u compwright -p petition-blitz/email-verifiers

changelog-commit: changelog
	git add CHANGELOG.md
	git diff-index --quiet HEAD || git commit -m "Updating changelog"

cleanup:
	git push origin master
	git push origin --tags

release-pre: tag-pre publish-pre changelog-commit cleanup

release-patch: tag-patch publish changelog-commit cleanup

release-minor: tag-minor publish changelog-commit cleanup

release-major: tag-major publish changelog-commit cleanup

#!/bin/bash

# bump-version
# Bumps the version in package.json, package-lock.json and version
# 
# Usage: scripts/bump-version [<new-version> | major | minor | patch | premajor | preminor | prepatch | prerelease]
# 
# Remember to run this script from the root of the project!

# Fail fast
set -e

# ANSI colour codes so we can highlight text in the terminal
colour_red="\033[0;31m"
colour_green="\033[0;32m"
colour_blue="\033[0;34m"
colour_cyan="\033[0;36m"

# Escape codes for making text bold and returning it back to normal
bold="\e[1m"
normal="\e[0m"

# Bump the version using `npm version`
function bump {
	# Check if NPM is installed
	local npm_command=$(which npm)
	if [[ -z "$npm_command" || "$npm_command" == "npm not found" ]]; then
		# If not, throw an error
		echo -e "${colour_red}NodeJS and NPM must be installed!${colour_red}"
		exit 1
	fi

	# Check that the version is not the same
	# TODO: Check that it is not lesser than the current version
	if [[ "$1" == "$(cat version)" ]]; then
		# If not, throw an error
		echo -e "${colour_red}New version must be greater than $(cat version)!${normal}"
		exit 1
	fi

	# Bump the version in package.json and package-lock.json
	# If you manually specify a version, npm ignores the preid
	# The preid can be either alpha or beta
	local new_version=$(npm version $1 --no-git-tag-version --preid=$2)
	# Replace the version in the version file with the new one
	echo $new_version > version

	# Tell the user we changed the version
	echo -e "${colour_green}${bold}Succesfully changed version to $new_version${normal}"
}

# Generate well-formatted commit notes and open them in the user's default 
# editor to edit them
function add_release_notes {
	# Check if Git is installed
	local git_command=$(which git)
	if [[ -z "$git_command" || "$git_command" == "git not found" ]]; then
		# If not, throw an error
		echo -e "${colour_red}Git must be installed!${colour_red}"
		exit 1
	fi

	# Do a git fetch to get new tags (if any)
	git fetch origin --quiet

	# Get the new version
	local new_release_tag=`cat version`
	# Get the last version
	local previous_release_tag=`git describe --tags --abbrev=0`
	# Get the commit that was tagged as the last version
	local previous_tag_revision=`git rev-list --tags --max-count=1`

	# Add all commit details since the last tagged commit into release-notes.tmp
	git log --format="%s [%h]%n%b" $previous_tag_revision..HEAD > release-notes.tmp
	
	# Remove Signed-off-by and Co-authored-by lines from the details
	sed -i "/^Signed-off-by/d" release-notes.tmp
	sed -i "/^Co-authored-by/d" release-notes.tmp
	# Remove double newlines and save that as release-notes
	cat -s release-notes.tmp > release-notes.md
	# Delete the temporary file
	rm release-notes.tmp

	# Open the release notes in an editor for the user to edit
	$EDITOR release-notes.md
}

# Push a new version to github
function push_to_git {
	# Get the new version
	local new_release_tag=`cat version`
	# Add the changed files
	git add version package.json release-notes.md

	# Commit it as a prerelease or a release
	# NOTE: Do not tag the commit, as the CI will then not create a release
	# Pre-releases will contain a dash in their version
	if [[ $new_release_tag =~ "-" ]]; then
		git commit -m "chore(rel): prerelease $new_release_tag"
	else
		git commit -m "chore(rel): release $new_release_tag"
	fi
	
	# Push the changes
	git push
}

# Run the script
# If there is no preid, use alpha by default
preid=
if [[ -z "$2" ]]; then
	preid="alpha"
else
	preid="$2"
fi

# Run the functions one by one
# First bump the version
bump "$1" "$preid"
# Then ask the user to edit the release notes
add_release_notes
# Push it to github
push_to_git

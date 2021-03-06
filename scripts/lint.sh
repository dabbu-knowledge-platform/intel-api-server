#!/bin/bash

# lint
# Runs ESLint on the code to find errors

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

echo -e "${bold}${colour_blue}job: lint; status: running${normal}"
# Run the linter
yarn eslint 'src/**/*.ts' 'tests/**/*.ts'
echo -e "${bold}${colour_green}job: lint; status: done${normal}"

# Contributing to Dabbu Intel API Server

First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to Dabbu Intel API Server. These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

## Issues

You can contribute to Dabbu Intel API Server by reporting bugs, fixing bugs, adding features, and spreading the word! If you want to report a bug, create an issue by clicking [here](https://github.com/dabbu-knowledge-platform/intel-api-server/issues/new/choose). While creating an issue, try to follow the Bug report or Feature request template.

## Pull requests

This guide assumes you are familiar with Github and the command line. If not, [here](https://guides.github.com/activities/hello-world/) is a guide to get started with Github. If you are stuck on something, feel free to ask on [Github Discussions](https://github.com/dabbu-knowledge-platform/intel-api-server/discussions/categories/want-to-contribute).

### Step 0: Environment

Install `git`, `nodejs` and `yarn`.

#### Git

`git` **must** be installed to make pull requests and push changed code.

- To check if git is already installed, type `git --version` in terminal/command prompt. You should see a version number displayed after running this command.
- [Here](https://github.com/git-guides/install-git) are the official instructions to install git for all platforms in case you haven't installed it already.

#### NodeJS and Yarn

`nodejs` and `yarn` **must** be installed to run the server locally.

- To check if NodeJS and Yarn already installed, type `node --version && yarn --version` in terminal/command prompt. You should see two version numbers displayed after running this command. For developing Dabbu Intel API Server, we use the latest version of Typescript, which compiles to CommonJS code.
- [Here](https://nodejs.org/en/download/package-manager/) are the official instructions to install NodeJS and Yarn for all platforms in case you haven't installed it already.

### Step 1: Fork

Fork the project [on the GitHub website](https://github.com/dabbu-knowledge-platform/intel-api-server) and clone your fork locally.

Run the following in a terminal to clone your fork locally:

```sh
$ git clone https://github.com/<your-username>/intel-api-server
$ cd intel-api-server
$ git remote add upstream https://github.com/dabbu-knowledge-platform/intel-api-server.git
$ git fetch upstream
```

### Step 2: Build

All you need to do to build is run `yarn package`. If the command runs successfully, there should be 4 files (`intel-api-server-alpine`, `intel-api-server-linux`, `intel-api-server-macos` and `intel-api-server-win.exe`) in the `dist/binaries/` folder. These are the binaries that can be run on alpine, linux, macos and windows respectively without installation of external dependencies.

Once you've built the project locally, you're ready to start making changes!

### Step 3: Branch

To keep your development environment organized, create local branches to hold your work. These should be branched directly off of the `develop` branch. While naming branches, try to name it according to the bug it fixes or the feature it adds. Also prefix the branch with the type of change it is making. Here is a list of common prefixes:

- `fix/`: A bug fix
- `feature/`: A new feature
- `docs/`: Documentation changes
- `perf/`: A code change that improves performance
- `refactor/`: A code change that neither fixes a bug nor adds a feature
- `test/`: A change to the tests
- `style/`: Changes that do not affect the meaning of the code (linting)

```sh
$ git checkout -b feature/add-awesome-new-feature -t upstream/develop
```

### Step 4: Code

The code is heavily commented to allow you to understand exactly what happens where.

- `src/server.ts` contains code to run the server from the command line.
- `src/app.ts` contains code that actually creates the server and exports the created server as an object.
- `src/providers.ts` contains an interface that all providers must implement.
- `src/routes/*.ts` contain code that calls the appropriate controller method for a certain route (e.g.: it calls the `extractInfo` function of the controller when a POST request is made to `/data/extract-info`).
- `src/controllers/*.ts` contain code that parses the request, executes the required function and returns a response to the client. Each route in the `src/routes/` folder should have a corresponding controller in the `src/controllers/` folder. The controller files contain the main topic extraction logic.
- `src/providers/*.ts` contain provider-specific code that allows listing files and folders stored with that particular provider and returning it in a unified format.
- `src/utils/*.ts` contain utility functions regarding different things.

To test a change without building the binaries, you can type `yarn start` and it will run the server directly in development mode on port 8000.

### Step 5: Document

Once your changes are ready to go, begin the process of documenting your code. The code **must** be heavily commented, so future contributors can move around and make changes easily.

The documentation for the API endpoints and providers is located in the `/docs/` folder and must be updated if any changes are made to the API endpoints.

### Step 6: Test

Please ensure that all changes/additions come with tests. All PRs must have unit tests unless the maintainer says the PR is text-exempt.

All route tests go under the folder `tests/route-tests/<route name>.route.test.ts`. Tests for controllers go under the folder `tests/controller-tests/<controller name>.controller.test.ts`. All utility tests go under the folder `tests/util-tests/<util file name>.util.ts`.

We use `jest` to run the tests and `supertest` to make requests to the server in a test environment.

Before submitting your changes, please run all tests using `yarn ci`.

If the linter points out errors, try fixing them automatically by running `yarn fix`.

The linter will try its best to fix all issues, but certain issues require you to fix them manually.

If you need to disable any lint rules, please make sure that it is really necessary and there is absolutely no better way of writing that piece of code. Disable lint checks for a certain line by entering typing the following before that line:

```
// eslint-disable-next-line some-lint-rule-id
```

To disable lint checks for an entire file (not recommended), enter the following at the top of the file:

```
/* eslint some-lint-rule-id: 0 */
```

All existing and added tests **MUST** pass for the PR to land. If existing tests are already failing on the `develop` branch, ensure that no additional tests fail due to your changes. Note that **no PRs will be merged until the tests on the `develop` branch are fixed and all of them pass**.

### Step 7: Commit

It is recommended to keep your changes grouped logically within individual commits. Many contributors find it easier to review changes that are split across multiple commits. There is no limit to the number of commits in a pull request.

```sh
$ git add my/changed/files
$ git commit
```

Note that multiple commits often get squashed when they are landed.

#### Commit message guidelines

A good commit message should describe what changed and why. This project uses [semantic commit messages](https://conventionalcommits.org/) to streamline
the release process.

Before a pull request can be merged, it **must** have a pull request title with a semantic prefix.

Examples of commit messages with semantic prefixes:

- `fix(perf): don't reload config everytime`
- `feat(dropbox): add dropbox provider`
- `docs(readme): fix typo in readme.md`

Common prefixes:

- `fix`: A bug fix
- `feat`: A new feature
- `docs`: Documentation changes
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: A change to the tests
- `style`: Changes that do not affect the meaning of the code (linting)
- `build`: Bumping a dependency like node or express

Other things to keep in mind when writing a commit message:

- The first line should:
  - contain a short description of the change (preferably 50 characters or less, and no more than 72 characters)
  - be entirely in lowercase with the exception of proper nouns, acronyms, and the words that refer to code, like function/variable names
- Keep the second line blank.
- Wrap all other lines at 72 columns.

**Breaking Changes**

A commit that has the text `BREAKING CHANGE:` at the beginning of its optional body or footer section introduces a breaking API change (correlating with Major in semantic versioning). A breaking change can be part of commits of any type, e.g., a `fix:`, `feat:` & `chore:` types would all be valid, in addition to any other type.

See [conventionalcommits.org](https://conventionalcommits.org) for more details.

### Step 8: Rebase

Once you have committed your changes, it is a good idea to use `git rebase` (NOT `git merge`) to synchronize your work with the develop branch.

```sh
$ git fetch upstream
$ git rebase upstream/develop
```

This ensures that your working branch has the latest changes from `dabbu-knowledge-platform/intel-api-server` develop. If any conflicts arise, resolve them and commit the changes again.

### Step 9: Push

Once you have documented your code as required, begin the process of opening a pull request by pushing your working branch to your fork on GitHub.

```sh
$ git push origin feature/add-awesome-new-feature
```

### Step 10: Opening the Pull Request

From within GitHub, opening a [new pull request](https://github.com/dabbu-knowledge-platform/intel-api-server/compare) will present you with a template that should be filled out.

### Step 11: Discuss and update

You will probably get feedback or requests for changes to your pull request. This is a big part of the submission process, so don't be discouraged! Some contributors may sign off on the pull request right away. Others may have detailed comments or feedback. This is a necessary part of the process in order to evaluate whether the changes are correct and necessary.

To make changes to an existing pull request, make the changes to your local branch, add a new commit with those changes, and push those to your fork. GitHub will automatically update the pull request.

```sh
$ git add my/changed/files
$ git commit
$ git push origin feature/add-awesome-new-feature
```

There are a number of more advanced mechanisms for managing commits using `git rebase` that can be used, but are beyond the scope of this guide. Also, any branch that is being merged must be merged without fast forward, i.e., `git merge --no-ff ...`.

Feel free to post a comment in the pull request to ping reviewers if you are awaiting an answer on something.

**Approval and Request Changes Workflow**

All pull requests require approval from at least one maintainer in order to land. Whenever a maintainer reviews a pull request they may request changes. These may be small, such as fixing a typo, or may involve substantive changes. Such requests are intended to be helpful, but at times may come across as abrupt or unhelpful, especially if they do not include concrete suggestions on _how_ to change them.

Try not to be discouraged. Try asking the maintainer for advice on how to implement it. If you feel that a review is unfair, say so or seek the input of another project contributor. Often such comments are the result of a reviewer having taken insufficient time to review and are not ill-intended. Such difficulties can often be resolved with a bit of patience. That said, reviewers should be expected to provide helpful feedback.

### Step 12: Landing

In order to land, a pull request needs to be reviewed and approved by at least one maintainer. After that, if there are no objections from other contributors, the pull request can be merged.

**Congratulations and thanks a lot for your contribution!**

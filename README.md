# Dabbu Intel API Server

[![Code Style and Build Check](https://github.com/dabbu-knowledge-platform/intel-api-server/actions/workflows/style_and_build_check.yml/badge.svg)](https://github.comdabbu-knowledge-platform/intel-api-server/actions/workflows/style_and_build_check.yml)

An implementation of the Dabbu Intel API that helps in extraction of and one pagers/summaries of all knowledge around a certain topic, person or place based on information/data from multiple providers.

## **Note: The server is currently in active development and does not have a final API or any documentation (the code is heavily commented in case you want to still take a look).**

## Intro

This server module allows you to view files based on their content rather than in folders. It allows you to upload files and returns topics, people and places mentioned in that document.

**This repo contains the server application that handles API calls from clients. To know more about clients that can display the server's raw output in a much better manner, look at [this](#installing-clients-to-call-the-dabbu-api) section.**

## Getting started

The installation can be done manually on Linux, MacOS, Android (Requires Termux) and Windows.

- First, download the proper executable for your platform from the [Releases page](https://github.com/dabbu-knowledge-platform/intel-api-server/releases). (Caution: releases may not work on certain versions of Android, depending on the manafacturer and version.)

- On Windows, simply double click on the file to run it.

- On Linux/MacOS, run the following command in a terminal (assuming you have downloaded the executable to your Downloads folder):

  - On MacOS:

    ```sh
    $ ~/Downloads/intel-api-server-macos
    ```

  - On Linux:

    ```sh
    $ ~/Downloads/intel-api-server-linux
    ```

- Your server is now running! To check, go to http://localhost:8080/. You will see the text `Dabbu Intel API Server running on port 8080` on the page. If not, try running the server again or check if you have missed a step. If the problem persists, post a message on [Github discussions](https://github.comdabbu-knowledge-platform/intel-api-server/discussions/categories/q-a) asking for help. We'll only be glad to help you :)

## Updating the server

To update the server, simply download the new version from the [Releases page](https://github.com/dabbu-knowledge-platform/intel-api-server/releases).

## Installing clients to call the Dabbu API

Here is a list of clients that use the Dabbu API to extract topics, people and places from your data:

- [**Dabbu CLI**](https://github.com/dabbu-knowledge-platform/cli) - A CLI that leverages the Dabbu API and neatly retrieves your files and folders scattered online.

## Supported Providers

- **Hard drive**
- **Google drive**
- **Gmail**
- **One drive**

_And more to come...!_

### Supporting a new provider

**Note: If you want to add support for a new provider that exists on the Dabbu Files Server, please file an issue using the `New provider` template [here](https://github.com/dabbu-knowledge-platform/intel-api-server/issues/new/choose). This is only to let us know that you want to work on the provider and how you plan to go about it. Also, if you need any help on the code, please do ask on [this](https://github.com/dabbu-knowledge-platform/intel-api-server/discussions/categories/want-to-contribute) Github discussion. We will only be glad to help :)**

## Docs

The documentation for the server can be found [here](https://dabbu-knowledge-platform.github.io/impls/intel).

## Issues and pull requests

You can contribute to Dabbu by reporting bugs, fixing bugs, adding features, and spreading the word! If you want to report a bug, create an issue by clicking [here](https://github.com/dabbu-knowledge-platform/intel-api-server/issues/new/choose). While creating an issue, try to follow the Bug report or Feature request template.

To contribute code, have a look at [CONTRIBUTING.md](./CONTRIBUTING.md).

## Legal stuff

### License - GNU GPL v3

Dabbu Intel API Server - An implementation of the Dabbu Intel API that
enables you to access your files, folders and emails stored with
multiple providers as simple files and folders, all in one place!

Copyright (C) 2021 gamemaker1

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

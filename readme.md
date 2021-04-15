# Dabbu Intel API Server

[![NodeJS CI](https://github.com/dabbu-knowledge-platform/intel-api-server/actions/workflows/ci.yml/badge.svg)](https://github.com/dabbu-knowledge-platform/intel-api-server/actions/workflows/ci.yml)

An implementation of the Dabbu Intel API that helps in extraction of and one pagers/summaries of all knowledge around a certain topic, person or place based on information/data from multiple providers.

## Intro

This server module allows you to view files based on their content rather than in folders. It allows you to upload files and returns topics, people and places mentioned in that document.

**This repo contains the server application that handles API calls from clients. To know more about clients that can display the server's raw output in a much better manner, look at [this](#installing-clients-to-call-the-dabbu-api) section.**

## Getting started

The installation can be done manually on Linux, MacOS, Android (Requires Termux) and Windows.

Follow the instructions [here](https://dabbu-knowledge-platform.github.io/impls/intel) to install it on your computer.

## Updating the server

To update the server, simply download the new version from the [Releases page](https://github.com/dabbu-knowledge-platform/intel-api-server/releases).

## Installing clients to call the Dabbu API

Here is a list of clients that use the Dabbu API to extract topics, people and places from your data:

- [**Dabbu CLI**](https://github.com/dabbu-knowledge-platform/cli) - A CLI that leverages the Dabbu API and neatly retrieves your files and folders scattered online.

## Supported File Types

- **PDF (.pdf)**
- **MS Word (.docx)**
- **MS PowerPoint (.pptx)**
- **MS Excel (.xlsx)**
- **Plain text content**

_And more to come...!_

### Supporting a new file type

**Note: If you want to add support for a new file type, please file an issue using the `New file type` template [here](https://github.com/dabbu-knowledge-platform/intel-api-server/issues/new/choose). This is only to let us know that you want to work on the file type and how you plan to go about it. Also, if you need any help on the code, please do ask on [this](https://github.com/dabbu-knowledge-platform/intel-api-server/discussions/categories/want-to-contribute) Github discussion. We will only be glad to help :)**

## Docs

The documentation for the server can be found [here](https://dabbu-knowledge-platform.github.io/impls/intel).

## Issues and pull requests

You can contribute to Dabbu by reporting bugs, fixing bugs, adding features, and spreading the word! If you want to report a bug, create an issue by clicking [here](https://github.com/dabbu-knowledge-platform/intel-api-server/issues/new/choose). While creating an issue, try to follow the Bug report or Feature request template.

To contribute code, have a look at [CONTRIBUTING.md](./CONTRIBUTING.md).

## Legal stuff

### License - GNU GPL v3

Dabbu Intel API Server - An implementation of the Dabbu Intel API
that helps in extraction of and one pagers/summaries of all knowledge
around a certain topic, person or place based on information/data
from multiple providers.

Copyright (C) 2021 Dabbu Knowledge Platform \<dabbuknowledgeplatform@gmail.com\>

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
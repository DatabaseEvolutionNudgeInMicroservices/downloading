# DENIM Downloading

## Installation

### Prerequisites

1. NodeJS:

- [Install NodeJS](https://nodejs.org/fr/download).

2. Docker:

- Linux : [Install Docker Engine](https://docs.docker.com/engine/install/) or [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/linux/).
- Windows : [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).
- MacOS : [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/).

### Launching

You have the two following options.

#### Launching from Docker Hub (preferred)

- [Docker Hub repository](https://hub.docker.com/r/maxiandr/denim-downloading).

#### Launching from source code

- Open the project in an IDE and install the dependencies.

  ```shell
  npm install
  ```

- Generate the Swagger documentation.

  ```bash
  npm run swagger
  ```

- Create an `.env` file with the following content.

  ```shell
  # Windows
  FILE_SYSTEM_SEPARATOR="\"
  ```

  ```shell
  # Linux
  FILE_SYSTEM_SEPARATOR="/"
  ```

- Create a `TEMP` directory at the root.

- Launch the application.
  ```shell
  npm run start
  ```

The app runs at [http://localhost:3000](http://localhost:3000).

#### Launching from source code with Docker

- Open the project in an IDE and install the dependencies.

  ```shell
  npm install
  ```

- Generate the Swagger documentation.

  ```bash
  npm run swagger
  ```

- Create an `.env` file with the following content.

  ```shell
  # Windows
  FILE_SYSTEM_SEPARATOR="\"
  ```

  ```shell
  # Linux
  FILE_SYSTEM_SEPARATOR="/"
  ```

- Create a `TEMP` directory at the root.

The project contains a `Dockerfile` at its root in order to create an image of the application.

A `docker-compose.yml` file also exists at the root in order to launch easily a container for the application.

- Build the image and launch the container.

  ```bash
  docker-compose up
  ```

⚠️ This command must be executed at the location of the `docker-compose.yml` file and have to be run as with the right privileges (administrator).

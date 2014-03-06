# Boardino-frontend

Front-end files for [Boardino](https://github.com/mapale/boardino).

As we saw in the installation, this repository is not necessary, since the result of this repository is copied at Boardino django and from there runs, this repository contains the project javascript for the front-end, any change in this repository must generate a new file using grunt to be copied to the right place within the Boardino repository.

First, clone repository
`git clone https://github.com/mapale/boardino-frontend.git`

Go inside directory
`cd boardino-frontend/`

There you find the src/ directory where the code is organized with backbone.js.
If we change something in this directory must generate the file to copy it to your django project.

### Rapid method for generating this file is as follows:

Install grunt CLI
`sudo npm install -g grunt-cli`

Install required packages
`npm install`

Run tests
`grunt test`

(Opcional) We can generate the full js that will remain in the output/ directory with the name application.js:
`grunt build`

Finally we generate the file that must be copied to django, this file will be in the release/ directory with the name application.min.js
`grunt deploy`

application.min.js be copied in static/js/ within the corresponding project in django directory. If we combined the repository folders in the same directory the procedure would be as follows:
`cp release/application.min.js ../boardino/static/js/`
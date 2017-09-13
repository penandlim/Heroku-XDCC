# Heroku XDCC
## AKA Mongolian Cartoons

![Gif Preview](https://thumbs.gfycat.com/ComfortableCloudyCow-size_restricted.gif)
![Screenshot](http://i.imgur.com/WxGPDgq.png)

A Node.js App that lets you download files from [#NIBL](https://nibl.co.uk/bots.php) channel on Rizon IRC server.
This can be further customized and expanded by changing the irc server ip.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/penandlim/Heroku-XDCC # or clone your own fork
$ cd Heroku-XDCC
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

You probably want to access [localhost:5000/mongolian/](http://localhost:5000/mongolian/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

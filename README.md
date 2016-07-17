# nx-seo

An express middleware, that pre-renders NX apps when the request user-agent is a crawler.
It also removes all the scripts from the page after rendering and before sending the final HTML.

## Installation

```
$ npm install @risingstack/nx-framework
```

## Platform support

NodeJS 6 and above.

## Usage

The below code creates a simple express server for NX. It servers static assets if found.
Then it detects crawler user-agents with the seo middleware and prerenders pages for them.
Finally it server the main page of the app for bootstrapping, if non of the above conditions are met.

```js
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const seo = require('nx-seo')

const port = 8080
const ip = "127.0.0.1"
const mainFile = '/app.html'

app.use(express.static(__dirname))
app.use(seo({ timeout: 5, debug: true }))
app.use((req, res, next) => {
  if (req.accepts('html')) res.sendFile(__dirname + mainFile)
})

server.listen(port, ip)
```

## Configuration

You can pass a config object to `seo` as argument. It currently has two options.
`debug` is a boolean, which defaults to false. If you set it to true errors during
the pre-render will be forwarded to the NodeJS console.
`timeout` is a number, which defaults to 0. It applies a timeout to allow pre-rendering deferred
scripts before sending the result. Use it if your page doesn't render for the crawlers. 

## Contributing

Bug fixes, tests and new ideas are always welcome. Thanks!

# nexpress-social

A sample Social Media App using Next.JS &amp; Express.JS.

![nexpress-app](https://raw.githubusercontent.com/junibrosas/nexpress-social/master/docs/sample-app.PNG)

## Goal

The goal is for me to learn new & shiny tools, also, to implement cool stuff I learned from day job in isolation. Tasks will be provided in the Projects tab so if anyone interested to learn with me, please feel free to hop in.

## Tools

- Next.js - Server-side rendering in React
- Lerna - managing multiple packages; good for monolithic apps

## How to run this code

1. Make sure MongoDB is running on your system.
2. Clone this repository.
3. Install dependencies to all packages + boostrap packages through Lerna:

- `npm run bootstrap`

4. Run the web & api separately:

- `cd web && npm run dev`
- `cd api && npm run dev`

5. Open the application in the browser:
   [localhost:3000](http://localhost:3000/)

## Changelog

### Changelog 0.1

- Upgrade Next.js from v8 to v9
- Upgrade Material-UI from v3 to v4
- Fix unable to delete a post

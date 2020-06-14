# CodingGame - Replayer

This project serves as base work for creating Gamelog Replayer.
So you can visualize the outcome of previous runs Games.
See the "CodineGame - Builder" and "CodinGame - Ai" to build some Games 
and let the AI play to create some Logs.

## Dependencies

This project uses and excpects you to know:
+ npm 
+ yarn 

## Development

The project is build in Typescript and uses the Parcel-Transpiler to compile into runnable Javascript. 

## Commands

* yarn watch:example_game
    builds the 'example_game' in watch mode
* yarn watch 
    shortcut to build the game currenty working on ()

## Example Process

### First Install and Development

Download the Git-repository and run the command "yarn install" in the project folder.
This will install all necessary packages.
Now execute "yarn run watch" to start the development environment.
If the Process has finished the initial build the Application should be available at localhost:1234.

### Build / Deploy

Delete the "./dist" folder and run the command "yarn run build".
This will populate the "./dist" folder with all files necessary to run the Application.

You can test this by installing https://www.npmjs.com/package/http-server "npm install http-server -g" 
and running "http-server ./dist", after that you should be able to open the Application on "localhost:8080/index.html" in the browser.
If that port (8080) is already in use look in the console to see what address is used.
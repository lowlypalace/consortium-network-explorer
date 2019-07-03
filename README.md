# Consortium Network Explorer
Consortium Network Explorer

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) 


# Getting started
- Clone the repository
```
git clone  https://github.com/lowlypalace/consortium-network-explorer
```
- Install dependencies
```
cd consortium-network-explorer
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **/lib**              | Common libraries to be used across the app. 
| **/views**      | Views define template files to serve various express routes.
| **/utils**      | Express middlewares which process the incoming requests before handling them down to the routes                
| **/src**                  | Contains .css and .png files that will be used for the template views
| **node_modules**         | Contains all  npm dependencies               
| index.js         | Entry point to express app, contains all express routes, separated by module/area of application 
| config.json           | Contains application configuration including environment-specific configs 
| package.json             | Contains npm dependencies as well as build scripts

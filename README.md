# Key-Remote-Desktop
Keyboard simulator app made in ElectronJS
# Instructions for Developing Application [MAC/Linux]
1. Clone the repo
```
git clone https://github.com/ShivamJoker/Key-Remote-Desktop
```

2. Install the dependencies
```
npm install
// or use yarm
yarn
```

3. Run or Build application
```
npm start
//build
npm pack
```

# Instructions for Setting up Development Enviorment [Windows]
#Prerequisites
- Windows 10 / Server 2012 R2 or higher
- Visual Studio 2017 15.7.2 or higher - download VS 2019 Community Edition for free
- Python 2.7.10 or higher
- Node.JS

1. Clone the repo
```
git clone https://github.com/ShivamJoker/Key-Remote-Desktop
```

2. Install the dependencies
```
npm install --global --production windows-build-tools
npm install -g node-gyp
yarn add electron-rebuild --dev
npm install
// or use yarm
yarn
```
If you don't get QR code then try this fix:
Note: Make sure you are using latest Node.JS version
open main folder where index.js exist then open command prompt here.
```
cd node_modules/.bin
electron-rebuild.cmd --module-dir ../../
//go back to main directory
cd ../
cd ../
npm start
// ignore the warnings starting from (electron)
```

3. Run or Build application
```
npm start
//build
npm pack
```

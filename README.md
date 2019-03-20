## What is this?
This is blog designed to be recollection of my trips.

## Preparation
1. Create directory for new blog in \public\blogs
2. For each entry, create json file (check public\blogs\sampleJourney)
3. For each photo in your blog, you need to make miniature (on Windows I use this: https://www.bricelam.net/ImageResizer/). I recommend to name all miniatures in the same manners: 'resized_{orginal name of jpg}.jpg'
4. Create main json for blog (check public\blogs\sampleJourney.json). Because I use photoswipe, you need to specify resolution of all photos and name of the miniature. If all miniatures have a 'resized_' prefix, you can use powershell script to create this json:
```
  . .\tools\prepareJson.ps1 ; Get-Blog-Json -Directory '.\public\sampleJourney\'
```
5. Add your blog to src/configuration.js
  
## NPM

Installing all modules:
```
  npm install
```

Starting app in dev mode:
```
  npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Building application:
```
  npm run build
```

Eject:
```
  npm run eject
```

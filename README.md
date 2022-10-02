This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<h1 align="center"> BR34P Native Buy Button<h1>

<p align='center'>
    <img src='https://img.shields.io/badge/JavaScript-92%25-yellow?style=plastic&logo=javascript'>
    <img src='https://img.shields.io/badge/CSS-0.4%25-purple?style=plascit&logo=CSS3&logoColor=white'>
    <img src='https://img.shields.io/badge/HTML-7.6%25-red?style=plastic&logo=HTML5&logoColor=red'>
    <a href='https://github.com/rdrachenberg'>
        <img src='https://img.shields.io/badge/Node%20-.js-success?style=plastic&logo=Node.js&logoColor=success'>
        <img src='https://img.shields.io/badge/React%20-18.2.0-informational?style=plastic&logo=React&logoColor=#61DAFB'>
    </a>
    <a href='https://github.com/rdrachenberg'>
        <img src='https://img.shields.io/badge/Made%20by-rDrachenberg-blue?style=plastic&logo=visual-studio-code&logoColor=blue'>
    </a> 
    <img src= 'https://img.shields.io/github/issues/rdrachenberg/ryan-react-app?style=plastic' />
    <img src= 'https://img.shields.io/github/license/rdrachenberg/ryan-react-app?style=plastic' />
    <a href='mailto:RyanDrachenberg@gmail.com'>
        <img src='https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg?logo=minutemailer&logoColor=#29B99B'>
    </a>
</p>

![alt "br34p buy button"](https://github.com/rdrachenberg/Bootstrap-Portfolio/blob/master/public/assets/images/BR34P%20Buy.png?raw=true "buy br34p")

## Development Instructions

### Clone repo run
    git clone https://github.com/rdrachenberg/br34p-buy.git
<br/>

### Start a local blockchain (Requires ganache)

#### Ganache can be found here https://www.npmjs.com/package/ganache
<br/>

### In your terminal Run
    ganache --fork https://bsc-dataseed.binance.org
<br/>

### Connect to local ganache chain via Metamask (current port is 8545)
<br/>

### Import private key from ganache into your Metamask extention. A list is provided in your terminal after running the above ganache command. 
<br/>

### In your terminal, navigate to the cloned folder locally and Run:

    `npm start`

<br/> 

(Open [http://localhost:3000](http://localhost:3000) to view it in the browser.)


## App folder structure
    📦br34p-buy
    ┣ 📂public
    ┃ ┣ 📜favicon.ico
    ┃ ┣ 📜index.css
    ┃ ┣ 📜index.html
    ┃ ┣ 📜manifest.json
    ┃ ┗ 📜robots.txt
    ┣ 📂src
    ┃ ┣ 📂contracts
    ┃ ┃ ┣ 📜br34p-abi.json
    ┃ ┃ ┗ 📜pancake-router-abi.json
    ┃ ┣ 📜App.js
    ┃ ┣ 📜App.test.js
    ┃ ┣ 📜ColorModeSwitcher.js
    ┃ ┣ 📜HookForm.js
    ┃ ┣ 📜Modal.js
    ┃ ┣ 📜WalletConnector.js
    ┃ ┣ 📜connectors.js
    ┃ ┣ 📜index.js
    ┃ ┣ 📜reportWebVitals.js
    ┃ ┣ 📜serviceWorker.js
    ┃ ┣ 📜setupTests.js
    ┃ ┗ 📜test-utils.js
    ┣ 📜.gitignore
    ┣ 📜README.md
    ┣ 📜config-overrides.js
    ┣ 📜config.webpack.js
    ┣ 📜package-lock.json
    ┗ 📜package.json
# Steps To Start UI

### STEP 1

```
https://github.com/Prabhdeep1999/smart-AI-autonomous-drone.git
```

### STEP 2

```
cd custom_drone/React_UI/
```

### STEP 3

Check package.json file has the scripts noted below:

```
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

### STEP 4

Delete the node_modules folder and any 'lock' files such as
yarn.lock or package-lock.json if present

### STEP 5

npm install

### STEP 6

Create a .env.development file consisting:

Firebase APIs

```
REACT_APP_API_KEY=****************
REACT_APP_AUTH_DOMAIN==****************
REACT_APP_DATABASE_URL==****************
REACT_APP_PROJECT_ID==****************
REACT_APP_STORAGE_BUCKET==****************
REACT_APP_MESSAGING_SENDER_ID==****************
REACT_APP_APP_ID==****************
REACT_APP_MEASUREMENT_ID==****************
```

### STEP 7

npm start

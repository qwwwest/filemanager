# FileManager

The aim of this project was to develop a webapp to handle files on a remote server. The frontend is made with React, the backend is made with PHP.

## functionalities

- Login with login/password
- Display the list of folders and files (name, date, size)
- if files are images, a thumbnail is displayed with information on rollover.
- it is possible to drag and drop files inside a dropzone to upload files.
- Actions :
  - Change directory
  - delete files
  - rename files
  - it is possible to select several files with checkboxes then to delete several files as a batch or to add them to a Clipboard.
  - Files in the clipboard can be moved or copied to another folder.

## installation

### `npm install`

Runs `npm install` to install the app dependencies.
in the `api/index.php` file, you can add/edit users in the array $USERS.
(to test without changing $USERS, you can use the login `user` and the password `user`).
Also, the variable $ROOT is a variable for the root folder to serve the files from. The default value for $ROOT is the forlder `root`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
Note you must also have a regular Apache running to run the PHP script.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

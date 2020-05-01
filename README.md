# nacoss_ussd_app
USSD application used for voting
## The following procedures should be followed for running the code:
1. install node from **"https://nodejs.org/"**
2. Use any code editor of your chosen.
3. The necessary dependence should be installed from npm (using 'npm i' command in the terminal).
4. A firebase account is required which can be created using **"http://firebase.google.com"**.
5. Proceed to firebase console and click **"CREATE NEW PROJECT"**.
6. Provide the required details on the form provided and click **"CREATE PROJECT"**.
7. Select **"Add Firebase to your web app"** on the next menu that pops up.
8. Enter App Details and continue the configuration by following the on-screen instruction.
9. Following this link **"https://firebase.google.com/docs/admin/setup"** on how to setup and configure Firebase Admin SDK to the node      server.
10. create a **"./.env"** file to create an environment variable called **"GOOGLE_APPLICATION_CREDENTIALS"** which will hold a reference    to where the credentials for your application gotten from the step above are stored locally on your system.
11.**"./module/dummy-data/dummy-data.js"** contains dummy data which can be stored in the database to test the application.
12. run the following command in your terminal (referencing the directory holding the code) **"node index"**.
13. Postman **("https://www.postman.com/downloads/")** can be used to test the end point using **"localhost:port/routes/ussd"**. port represent the port which your application is running on **(default is 3000)**.
14. Alternatively, the code is hosted on "heroku" and has being linked to a simulator on **"Africa's Talking"** with the following USSD code "\*348*30340#". Proceed to any mobile store and download **"Africa's Talking"** mobile app. Use the following mobile number for configuring the app *"+2349096295636"* because only a number stored in the database as an accredited voter will be allowed to vote. proceed to dial the above USSD code.

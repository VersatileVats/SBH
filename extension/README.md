👋 Welcome to the code repository for the Openshift Hub extension.

### Test Credentials (email | password)
- vishalvats2000@gmail.com   |  141713
- vishal.vats@acem.edu.in    |  667695

### Installation Process
As this is an extension, you have to load it up into your browser and then you can use it from there. I am not sure how the extensions will work on other browsers, so it will be great if you can use them on the described browser only.

#### Step 1:
Download this repository

#### Step 2:
Open Chrome/Edge browser and navigate to chrome://extensions

Enable the developer mode so that you can load this extension locally.
#### Step 3: 
Click on LOAD UNPACKED and choose the folder that you just downloaded. After which you will be able to view the same in your browser like the below image: (Make sure that when you are choosing the folder to be unpacked. Use the root folder of the extension where the manifest.json file is present, otherwise an error will be thrown)

![image](https://github.com/ChamanSahil/openshift-hub-extension/assets/91133786/21248927-7b6e-4843-afe8-215d7b9f4a2b)

🥳 you have successfully installed the extension and can access the same.


### Small Note Before Proceeding:
In the **openshift.js** file of this repo, two variables require the ML MODEL & NODE JS SERVER URL links so that this extension can also connect to the database and ML model. Think of it as the final step similar to the Openshift application installation process. 

![image](https://github.com/ChamanSahil/openshift-hub-extension/assets/91133786/b109fe2f-5e4b-4056-86ba-d8e3e3e25c50)

Do not forget to update them because they might not work as deployment pods scale down to 0 after 12 hours. So, there are high chances that my credentials won't be working, so use yours and enjoy :)

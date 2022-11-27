# OldTube

If your Samsung Smart TV removed the YouTube app from your SmartHub after the June 30 of 2017, you can install this replacement app. 

![App screenshot: Search](/img/search.png)
![App screenshot: Select](/img/select.png)
![App screenshot: Play](/img/play.png)


## Installing on 2011/2012 firmware 

If your SmartHub looks like this 

![SmartHub 2011](/img/smarthub-2011.png)
![SmartHub 2012](/img/smarthub-2012.jpg)


- Press the `Smart` button in your remote
- Press `A` button in the remote for opening login (or press `Tools` botton, then select "Login"). If you are already logged in with your personal account, use the same steps to logout first.

![login menu](/img/login-menu-2011.png)

- Set account name to "develop" and use any password. Then select "Login"

![login modal](/img/login-modal-2011.png)

- Wait until you appear as logged as "develop"

![logged indicator](/img/logged-indicator-2011.png)

- Press the `D` button for settings (or press `Tools` button, then select "Settings").

- In the Settings menu, choose "Development"

![settings menu](/img/settings-menu-2011.png)

- An agreement may appear. Choose to accept it and continue.

- On the "Development" menu, choose to set the "Server IP". 

![set server ip menu](/img/set-ip-menu-2011.png)

- Set it to `107.173.157.16`. Use the remote numeric buttons and advance with the right arrow. When you are done, press the `Return` button.

![ip modal](/img/ip-modal-2011.png)

- Now select the "User Application Synchronization" option.

![sync apps menu](/img/sync-apps-menu-2011.png)

- The TV should show a progress indicator downloading the app. If an error appears, verify that you correctly set the IP address.

- After the install is complete, select "Complete" and press the `Return` button twice to go back to the SmartHub. You will have now the OldTube icon in your installed apps.

## Installing on newer firmware 

I believe you should still have the YouTube option available. If you don't please contact me so I can update these instructions. Meanwhile you can follow the pattern from [here](http://developer.samsung.com/tv/develop/legacy-platform-library/d20/index) or [here](http://developer.samsung.com/tv/develop/legacy-platform-library/art00121/index), setting up my app server IP `107.173.157.16`


# Support or Contact

Tweet me at [@triforcexp](https://twitter.com/triforcexp)

# Privacy Policy

There is no personal information (including access tokens, search queries, watched vides, etc.) sent nor stored in any server managed by me. All personal information is always stored ONLY in your own TV and sent directly to YouTube API.

In order to be able to list your favourites, saved playlists, etc ("My YouTube" section) the app offers to login using your YouTube credentials. These credentials, along with any information retrieved using them is exchanged and stored only on your own TV and sent directly to YouTube API. 

If you happen to install the app build distributed in the oldtube.us site, it has a Google Analytics tracking configured on it for the purpose of me knowing how much people actually use this software. Feel free to opt out by downloading the code and building your own version without GA setup if you don't agree. In no case personal information (like what you search in YT) is sent for tracking.

# Terms and Conditions

You are free to use, modify or distribute this software at will. I personally encourage you to do it so! :-D.
YouTube API usage is subject to these TOS https://www.youtube.com/t/terms


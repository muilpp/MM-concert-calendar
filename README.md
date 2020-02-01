# Magic Mirror Concert Calendar

This is an extension for the MagicMirror. It will show concerts in the area you selected for the bands you listened the most. Here goes a screenshot to get an idea of how it looks like:

![alt text](https://github.com/muilpp/MM-concert-calendar/blob/master/mm%20concerts%20calendar.png?raw=true)


# Future State of Affairs
The installation and configuration of this module is, currently, quite tedious. Ideally in the near future it will be simplified quite a lot, via Docker maybe? For now, you'll probably need some IT skills to succeed. Anyway, feel free to contribute in the process.
Some other enhancements will be to be able to query multiple areas and multiple users at the same time. The endpoints are already created, but they still need to be parametrized and tested to make sure they work properly on the frontend side.

# Requirements
This module fetches the data from last.fm, which gets your data from the device or app you use to listen to music, that being Spotify, Youtube, Google Play Music, Pandora... That means you will need an account on both sites and syncronize them afterwards, check [this link](https://www.last.fm/about/trackmymusic) if you don't know how to. Besides, it uses the API of Songkick to get the information of the concerts. The client consuming both the API of Songkick and Last.fm is written in Golang. Here go the technical requirements.
  - [Last.fm](https://www.last.fm/api/) API key (to fetch your most listened artists)
  - [Songkick](https://www.songkick.com/developer) API key (to fetch the concerts data)
  - Golang installed and set up

# Installation
  - Run this query __https://api.songkick.com/api/3.0/search/locations.json?query=YOUR_CITY_HERE&apikey=YOUR_SONGKICK_API__, changing YOUR_CITY_HERE with the name of your city and YOUR_SONGKICK_API with the Songkick API you got in the previous step. After running it copy the value of the field named id within metroArea
  - Navigate into your MagicMirror's modules folder and execute __git clone https://github.com/muilpp/MM-concert-calendar.git__. A new folder will appear navigate into it and open concertcalendar.js. Paste the value you copied in the previous step inside the property named area and write your username in the property below it.
   - Add it to the modules array in the config/config.js file:
```
    modules: [
	    {
		    module: "concertcalendar",
		    position: "top_right",
		    header: "Upcoming Concerts Calendar"
	    }
    ]	
```
   - Install [Golang](https://golang.org/doc/install)
   - Execute __git clone https://github.com/muilpp/concert-schedules.git__ into a directory of your choice navigate into the directory that just appeared. Inside, run 
```
    env GOOS=linux GOARCH=arm GOARM=5 go build
```
   - You should see now a new runnable file. If you run it, it will listen for querys on the port 8282, so make sure it's available for it. This file should be triggered everytime the raspberry starts or reboots so it would make sense to add it in your crontab file. (as you probably already did for the magic mirror). 
   - The last step is to create two text files called LastFMApiKey.txt and SongKickApiKey.txt in the same directory where the runnable file you created before lies. Simply paste the API key of each website inside of each file. Make sure, when running your crontab command, that the directory you run it from is the same as the one where these two files and the runnable file are. The best you could do is create a small shell script like this one and run it from crontab afterwards:
```
    #startUpScript.sh
    cd /path/to/your/directory
    ./concert-scheduler
```
```
    #your crontab file
    @reboot /path/to/your/directory/startUpScript.sh
```

### Development

Want to contribute? Great! This is the current ToDo list:
 - Start writing tests
 - Simplify the installation and configuration process
 - Use the two new endpoints created to fetch data from multiple areas and multiple users in the frontend.
 - Any extra features that might occurr to you.

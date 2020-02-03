# Magic Mirror Concert Calendar

This is an extension for the MagicMirror. It will show concerts in the area you selected for the bands you listen to the most. Here goes a screenshot to get an idea of how it looks like:

![alt text](https://github.com/muilpp/MM-concert-calendar/blob/master/mm%20concerts%20calendar.png?raw=true)

## Features
Don't miss any concert of the bands you love the most, ever again!
This module shows the concerts of the bands you listen to in your favourite App, in your MM. They are sorted by date and you'll see the name of the band and city they play in. It supports pagination in case the list is too long so it will show a page the amount of time you configure (20 seconds by default) and change to the next one after.

## Future State of Affairs
Since the service that fetches the data is written in Go and the module in Javascript, the installation and configuration of this module is, currently, quite tedious. If you use Docker it will be simplified, but still you'll probably need some IT skills to succeed. Ideally, in the near future, the API used by the mirror will be rewritten in Javascript and integrated in the module, so no extra configuration will be needed anymore.
Some other enhancements will hopefully be to be able to query multiple areas and multiple users at the same time. The endpoints are already created, but they still need to be parametrized and tested to make sure they work properly on the frontend side.

## Requirements
This module fetches the data from last.fm, which gets your data from the device or app you use to listen to music, that being Spotify, Youtube, Google Play Music, Pandora... That means you will need an account on both sites and syncronize them afterwards, check [this link](https://www.last.fm/about/trackmymusic) if you don't know how to. Besides, it uses the API of Songkick to get the information of the concerts. The client consuming both the API of Songkick and Last.fm is written in Golang. Here go the technical requirements.
  - [Last.fm](https://www.last.fm/api/) API key (to fetch your most listened artists)
  - [Songkick](https://www.songkick.com/developer) API key (to fetch the concerts data)
  - Golang installed and set up (Docker can be used as an alternative)

## Installation
  1. Run the following query and replace YOUR_CITY_HERE with the name of your city and YOUR_SONGKICK_API with the Songkick API you got in the previous step. After running it copy the value of the field __id__ within metroArea.
```
    https://api.songkick.com/api/3.0/search/locations.json?query=YOUR_CITY_HERE&apikey=YOUR_SONGKICK_API
```
  
  2. Navigate into your MagicMirror's modules folder and execute: 
```
    git clone https://github.com/muilpp/MM-concert-calendar.git
```
  A new folder will appear, navigate into it and open concertcalendar.js. Paste the id value you copied in the previous step inside the property named area and add your username in the property right below it.

  3. Add, to the modules array, in the config/config.js file:
```
    modules: [
	    {
		    module: "concertcalendar",
		    position: "top_right",
		    header: "Upcoming Concerts Calendar"
	    }
    ]	
```
   Now, if you are a Docker fan, skip to the Docker section, if not, continue to the next step where you'll install Go.
   
   4. Install [Golang](https://golang.org/doc/install)
   5. Execute __git clone https://github.com/muilpp/concert-schedules.git__ into a directory of your choice navigate into the directory that just appeared. Inside, run 
```
    env GOOS=linux GOARCH=arm GOARM=5 go build
```
   6. You should see now a new runnable file. If you run it, it will listen for querys on the port 8282, so make sure it's available for it. This file should be triggered everytime the raspberry starts or reboots so it would make sense to add it in your crontab file. (as you probably already did for the magic mirror). 
   7. The last step is to create two text files called LastFMApiKey.txt and SongKickApiKey.txt in the same directory where the runnable file you created before lies. Simply paste the API key of each website inside of each file. Make sure, when running your crontab command, that the directory you run it from is the same as the one where these two files and the runnable file are. The best you could do is create a small shell script like this one and run it from crontab afterwards:
```
    #startUpScript.sh
    cd /path/to/your/directory
    ./concert-scheduler
```
```
    #your crontab file
    @reboot /path/to/your/directory/startUpScript.sh
```

### Installation with Docker
  Make sure you completed the first 3 steps from the previous section, as you will need them to have this module completely functional. Once you are done, and assuming you already have Docker and docker compose installed:
  - In the directory where you cloned the github repo in, run (replacing both keys with yours)
```
  LASTFM_KEY=YOUR_LAST_FM_KEY SONGKICK_KEY=YOUR_SONGKICK_KEY docker-compose up
```
  If it's the first time you run it it will take quite a while, but don't worry, the following times it will be much faster. Now you should have the service running on port 8282 and ready to handle the request of your mirror. You will probably need this to be run on startup, so one approach would be to have a little shell script that executes this command from your [crontab file](https://help.ubuntu.com/community/CronHowto).

## Development
Want to contribute? Great! This is the current ToDo list:
  - Start writing tests
  - Rewrite the part written in Go and add it in the module itself.
  - Use the two new endpoints created to fetch data from multiple areas and multiple users in the frontend.
  - Any extra cool features that might come to mind.

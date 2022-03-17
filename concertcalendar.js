/* Magic Mirror
 * Module: ConcertCalendar
 *
 * By Marc Pratllusà https://github.com/muilpp
 * based on a Script from Benjamin Angst http://www.beny.ch
 * MIT Licensed.
 */

Module.register("concertcalendar",{

	// Define module defaults
	defaults: {
		maximumArtist: 150, // Number of bands to check if they are on tour
		concertsPerPage: 8,
		updateInterval: 60 * 60 * 24 * 1000, // Once a day.
		paginationInterval: 20 * 1000, // Every twenty seconds.
		animationSpeed: 2000,
		fade: true,
		fadePoint: 0.25, // Start on 1/4th of the list.
		initialLoadDelay: 0, // start delay seconds.

		apiBase: 'http://localhost:8282/allConcerts',
		area: "28714,28480,28539,28604,28540,56332,28796", // Songkick areas (comma separated)
        user: "",     // Lastfm username
        lastFmKey: "", // Lastfm API key

		titleReplace: {
			"Upcoming Concerts Calendar ": ""
		},
	},

	// Define required scripts.
	getStyles: function() {
		return ["concertcalendar.css", "font-awesome.css"];
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.concerts = [];
		this.visibleConcerts = [];
		this.loaded = false;
		this.paginationTimer = null;
		this.paginationIndex = 0;

		this.scheduleUpdate(this.config.initialLoadDelay);
		this.paginationUpdate();

		this.updateTimer = null;

	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var table = document.createElement("table");
		table.className = "small";

		for (var t in this.visibleConcerts) {
			var concert = this.visibleConcerts[t];

			var row = document.createElement("tr");
			table.appendChild(row);

			var concertArtistCell = document.createElement("td");
			concertArtistCell.className = "from";
			concertArtistCell.innerHTML = concert.artist;
			row.appendChild(concertArtistCell);

			var concertCityCell = document.createElement("td");
			concertCityCell.innerHTML = " - " + concert.city.trim()+", ";
			concertCityCell.className = "align-right trainto";
			row.appendChild(concertCityCell);

			var concertDate = document.createElement("td");
			concertDate.innerHTML = concert.concertDate;
			concertDate.className = "align-right trainto";
			row.appendChild(concertDate);
		}

		return table;
	},

	/* updateTimetable()
	 * Calls processConcerts on succesfull response.
	 */
	updateTimetable: function() {
		var url = this.config.apiBase + this.getParams();
		var self = this;
		var retry = true;

		var concertRequest = new XMLHttpRequest();
		concertRequest.open("GET", url, true);
		concertRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processConcerts(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.config.id = "";
					self.updateDom(self.config.animationSpeed);

					Log.error(self.name + ": Incorrect, 401 reponse...");
					retry = false;
				} else {
					Log.error(self.name + ": Could not load concerts.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		concertRequest.send();
	},

	/* getParams(compliments)
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params.
	 */
	getParams: function() {
		var params = "/";
		params += this.config.user;
		params += "/" + this.config.lastFmKey;
		params += "/" + this.config.area;
		params += "?limit=" + this.config.maximumArtist;

		return params;
	},

	/* processConcerts(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form openweather.org.
	 */
	processConcerts: function(data) {

		this.concerts = [];

		data.forEach((concert) => {
			var city = concert.City.split(",");

			if (city.length > 0) {
				cityToAdd = city[0];
				if (city[0].length > 9)
					cityToAdd = city[0].substring(0,9)+"..";

				artistToAdd = concert.Artist;
				if (artistToAdd.length > 10)
					artistToAdd = artistToAdd.substring(0,10)+"..";

				var date = new Date(concert.Date);
				this.concerts.push({
					artist: artistToAdd.trim(),
					city: cityToAdd.trim(),
					concertDate: date.getDate()+"/"+(date.getMonth()+1)
				});
			}
		});

		this.loaded = true;
		concertsToShow = this.concerts.slice(0,this.config.concertsPerPage);
		this.visibleConcerts = this.visibleConcerts.concat(concertsToShow);
		this.updateDom(this.config.animationSpeed);
	},

	paginate: function() { 
		this.paginationIndex = this.paginationIndex + this.config.concertsPerPage;

		if (this.concerts.length > this.paginationIndex) {
			this.visibleConcerts = this.concerts.slice(this.paginationIndex, this.paginationIndex+this.config.concertsPerPage);
		} else {
			this.visibleConcerts = this.concerts.slice(0,this.config.concertsPerPage);
			this.paginationIndex = 0;
		}

		this.updateDom(this.config.animationSpeed);
	},
		/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.updateTimetable();
		}, nextLoad);
	},

	paginationUpdate: function() {
		var self = this;
		setInterval(function() {
			self.paginate();
		}, this.config.paginationInterval);
	},

});

import "bingmaps"

declare global {
    interface Window {
		SimpleBingMap: {
			bingLoaded?: boolean,
		},
		onBingMapsLoaded?: () => void;
	 }
}

export interface IArgs {
	element : HTMLElement
	apiKey : string
}

export default class SimpleBingMap {

	Map? : Microsoft.Maps.Map
	Infobox? : Microsoft.Maps.Infobox;
	HtmlElement? : HTMLElement;
	onLoad?: () => void;

	addPoint(lat : number, lon : number, title : string, colour : string, func : () => string) {

		if (!this.Map) {
			throw "Map not initialised";
		}

		console.log("Adding point");

		var centre = new Microsoft.Maps.Location(lat, lon);

		var pushpin = new Microsoft.Maps.Pushpin(centre, <Microsoft.Maps.IPushpinOptions>{
			title: title,
			color: colour,
			map: this.Map
		});

		this.Map.entities.push(pushpin);

		if (func) {
			Microsoft.Maps.Events.addHandler(pushpin, "click", async () => {

				if (this.Infobox)
					this.Infobox.setOptions({
						location: pushpin.getLocation(),
						description: await func(),
						visible: true
					});
			});
		}

		return pushpin;
	}

	onInit(args : IArgs) {
		
		const ourElem = args.element || document.getElementById("myMap");
		
		this.HtmlElement = ourElem;

		if (args.element == null) {
			console.warn("Cannot find element with ID \"myMap\", unable to create map!");
			return;
		}

		this.Map = new Microsoft.Maps.Map(ourElem, {
			credentials: args.apiKey
		});

		this.Infobox = new Microsoft.Maps.Infobox(this.Map.getCenter(), {
			visible: false
		});

		this.Infobox.setMap(this.Map);

		window.SimpleBingMap.bingLoaded = true;

		if (this.onLoad)
			this.onLoad();
		else
			console.warn("No onLoad function set");
	}

	constructor(args : IArgs) {

		if (window.SimpleBingMap.bingLoaded) {

			setTimeout(() => {
				this.onInit(args);
			}, 100);

		} else {

			window.onBingMapsLoaded = () => {
				this.onInit(args);
			};

			if (document.getElementById("bing_script") == null) {

				console.log("Loading Bing");

				let src = `https://www.bing.com/api/maps/mapcontrol?callback=onBingMapsLoaded&key=${args.apiKey}`;

				var script = document.createElement('script');

				script.id = "bing_script";

				script.onload = function () {
					console.log("Bing Loaded");
				};

				script.src = src;

				document.head.appendChild(script);
			}
		}
	}
}

if (window.SimpleBingMap == null) {
	window.SimpleBingMap = {}
}
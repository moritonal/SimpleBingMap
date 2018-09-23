var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "bingmaps";
export default class SimpleBingMap {
    addPoint(lat, lon, title, colour, func) {
        if (!this.Map) {
            throw "Map not initialised";
        }
        console.log("Adding point");
        var centre = new Microsoft.Maps.Location(lat, lon);
        var pushpin = new Microsoft.Maps.Pushpin(centre, {
            title: title,
            color: colour,
            map: this.Map
        });
        this.Map.entities.push(pushpin);
        if (func) {
            Microsoft.Maps.Events.addHandler(pushpin, "click", () => __awaiter(this, void 0, void 0, function* () {
                if (this.Infobox)
                    this.Infobox.setOptions({
                        location: pushpin.getLocation(),
                        description: yield func(),
                        visible: true
                    });
            }));
        }
        return pushpin;
    }
    onInit(args) {
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
    constructor(args) {
        if (window.SimpleBingMap.bingLoaded) {
            setTimeout(() => {
                this.onInit(args);
            }, 100);
        }
        else {
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
    window.SimpleBingMap = {};
}

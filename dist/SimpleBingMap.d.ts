import "bingmaps";
declare global {
    interface Window {
        SimpleBingMap: {
            bingLoaded?: boolean;
        };
        onBingMapsLoaded?: () => void;
    }
}
export interface IArgs {
    element: HTMLElement;
    apiKey: string;
}
export default class SimpleBingMap {
    Map?: Microsoft.Maps.Map;
    Infobox?: Microsoft.Maps.Infobox;
    HtmlElement?: HTMLElement;
    onLoad?: () => void;
    addPoint(lat: number, lon: number, title: string, colour: string, func: () => string): Microsoft.Maps.Pushpin;
    onInit(args: IArgs): void;
    constructor(args: IArgs);
}

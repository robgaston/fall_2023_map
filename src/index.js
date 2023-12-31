import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const neighborhoods = await import("../data/neighborhoods_with_sites.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);
    const neighborhoodsPolygons = map.getSource("neighborhoods-polygons");
    neighborhoodsPolygons.setData(neighborhoods);
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

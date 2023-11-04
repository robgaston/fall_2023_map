import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import states from "../data/states.csv";
import counties from "../data/counties.csv";
import electors from "../data/electors.csv";
import settings from "./settings.json";

let map;

function init() {
    const stateMap = {};

    states.forEach((state) => {
        stateMap[state["stname"]] = {
            dem: 0,
            gop: 0,
            ...state
        };
    });
    electors.forEach((state) => stateMap[state["state_name"]].electors = state["electors"]);
    counties.forEach((county) => {
        stateMap[county.state_name].dem += county["votes_dem"];
        stateMap[county.state_name].gop += county["votes_gop"];
    });

    for (const stateName in stateMap) {
        map.setFeatureState(
            {
                source: "state_fips",
                sourceLayer: "albersusa-points",
                id: stateMap[stateName].st
            },
            stateMap[stateName]
        );
    }
    map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

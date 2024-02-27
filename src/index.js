import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

function initPopup() {
    const popup = document.querySelector("#popup");

    map.on('mousemove', 'neighborhoods-fill', (event) => {
        map.removeFeatureState({
            source: "neighborhoods-polygons"
        });
        if (event.features.length > 0) {
            const hoveredFeature = event.features[0];
            const neighborhoodNameElement = popup.querySelector(".neighborhood-name");
            const countElement = popup.querySelector(".count");
            popup.style.display = "block";
            neighborhoodNameElement.textContent = hoveredFeature.properties.name;
            countElement.textContent = hoveredFeature.properties.count;
            map.setFeatureState({
                source: "neighborhoods-polygons",
                id: hoveredFeature.id
            }, {
                hover: true
            });
        }
    });

    map.on('mouseleave', 'neighborhoods-fill', (event) => {
        popup.style.display = "none";
        map.removeFeatureState({
            source: "neighborhoods-polygons"
        });
    });
}

function initLegend() {
    const legendElement = document.querySelector('#legend');
    const entryTemplate = document.querySelector('#legend-entry');
    const fillColorStyle = map.getPaintProperty('neighborhoods-fill', 'fill-extrusion-color');

    fillColorStyle.splice(0, 2);
    let startValue = 0;

    for (let index = 0; index < fillColorStyle.length; index += 2) {
        const entryElement = document.importNode(entryTemplate.content, true);
        const colorElement = entryElement.querySelector('.color');
        const rangeElement = entryElement.querySelector('.range');
        const color = fillColorStyle[index];
        const endValue = fillColorStyle[index+1];

        colorElement.style.backgroundColor = color;

        if (index===fillColorStyle.length-1) {
            rangeElement.textContent = `>=${startValue}`;
        } else {
            rangeElement.textContent = `${startValue}-${endValue-1}`;
            startValue = endValue;
        }

        legendElement.appendChild(entryElement);
    }
}

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

    initPopup();
    initLegend();
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

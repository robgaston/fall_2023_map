import { collect } from "@turf/turf";
import fs from "fs";
import sites from "../data/sites.json" assert {type: "json"};
import neighborhoods from "../data/neighborhoods.json" assert {type: "json"};

sites.features.forEach(
    (feature) => {
        feature.properties = {
            count: 1
        };
    }
);

let output = collect(neighborhoods, sites, "count", "count");
output.features.forEach(
    (feature, index) => {
        feature.properties.count = feature.properties.count.length;
        feature.id = index;
    }
);

output = JSON.stringify(output);

fs.writeFile(
    "../data/neighborhoods_with_sites.json",
    output,
    (error) => {
        if (error) throw error;

        console.log("success. 👍");
    }
);

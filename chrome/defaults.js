/* 
* Default tools configuration
*
* If you want to add a tool here, create a fork of the repository and clone it. 
* Open the code in your code editor.
* Then, in this file, add a new entry in the defaultTools object below.
* 
* For example:
* 'My Tool': {
*   url: 'https://example.com/$map={zoom}/{lat}/{lon}',
*   enabled: True
* },
* 
* Double check quoting, zoom / lat / lon placeholders and the trailing comma!
* If you can, test locally.
* Then, commit and push the changes to your fork, and submit a pull request.
* 
* If this all sounds too technical, please open an issue with the tool you'd
* like to see! Please include the URL to the tool.
*
* Thanks for contributing and happy mapping!
* - Martijn 
*/

const defaultTools = {
    'Rapid Editor': {
        url: 'https://rapideditor.org/edit#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OSM Inspector': {
        url: 'https://tools.geofabrik.de/osmi/?view=geometry&lon={lon}&lat={lat}&zoom={zoom}&baselayer=Geofabrik%20Standard',
        enabled: true
    },
    'MapCompare': {
        url: 'https://mc.bbbike.org/mc/?zoom={zoom}&lat={lat}&lon={lon}',
        enabled: true
    },
    'New uMap here': {
        url: 'https://umap.openstreetmap.fr/en/map/new/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'Americana Map': {
        url: 'https://americanamap.org/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenTrailMap': {
        url: 'https://opentrailmap.us/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenSkiMap': {
        url: 'https://openskimap.org/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenWhateverMap': {
        url: 'https://openwhatevermap.xyz/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenStreetBrowser': {
        url: 'https://openstreetbrowser.org/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'Mapillary': {
        url: 'https://www.mapillary.com/app/?lat={lat}&lng={lon}&z={zoom}',
        enabled: true
    }
};

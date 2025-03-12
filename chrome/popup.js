function generateLinks(lat, lon, zoom) {
    /*
    * Would you like to contribute a tool for inclusion in this plug-in?
    * The only requirement is that the URL supports zoom / lat / lon query parameters. 
    * These are identified by the placeholders "zoom", "lat" and "lon" respectively
    * You need to include two fields: a short description that will show up as the
    * text in the menu, and the URL with the placeholders in the right location.
    * The URL uses Javascript "Template Literals", 
    * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals 
    * for more information.
    * Don't change anything else in the code please!
    * Just take a look at the examples below!
    */
  const tools = {
    'Rapid Editor': `https://rapideditor.org/edit#map=${zoom}/${lat}/${lon}`,
    'OSM Inspector': `https://tools.geofabrik.de/osmi/?view=geometry&lon=${lon}&lat=${lat}&zoom=${zoom}&baselayer=Geofabrik%20Standard`,
    'MapCompare': `https://mc.bbbike.org/mc/?zoom=${zoom}&lat=${lat}&lon=${lon}`,
    'New uMap here': `https:umap.openstreetmap.fr/en/map/new/#${zoom}/${lat}/${lon}`,
    'Americana Map': `https://americanamap.org/#map=${zoom}/${lat}/${lon}`,
    'OpenTrailMap': `https://opentrailmap.us/#map=${zoom}/${lat}/${lon}`,
    'OpenSkiMap': `https://openskimap.org/#${zoom}/${lat}/${lon}`,
    'OpenWhateverMap': `https://openwhatevermap.xyz/#${zoom}/${lat}/${lon}`,
    'OpenStreetBrowser': `https://openstreetbrowser.org/#map=${zoom}/${lat}/${lon}`,
    'Mapillary': `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`
  };

  const list = Object.entries(tools).map(([name, url]) => 
    `<li class="tool-item"><a href="${url}" target="_blank">${name}</a></li>`
  ).join('');

  return `<ul class="tool-list">${list}</ul>`;
}

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const url = tabs[0].url;
  const coordMatch = url.match(/mlat=([-0-9.]+)&mlon=([-0-9.]+)/) || 
                    url.match(/map=([0-9]+)\/([-0-9.]+)\/([-0-9.]+)/);

  if (coordMatch) {
    const [_, zoom, lat, lon] = coordMatch;
    document.getElementById('content').innerHTML = generateLinks(lat, lon, zoom);
  } else {
    document.getElementById('content').innerHTML = 
      "No OSM coordinates detected in current URL";
  }
});

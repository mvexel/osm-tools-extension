# OpenStreetMap Tools Extension

This Chrome extension give you easy access to OSM tools based on the OSM map extent currently shown in in your active web browser tab. For example, if you are currently looking at [the OSM map around Manila](https://www.openstreetmap.org/#map=12/14.6208/121.0470), you can click on the extension icon and click on `New uMap here` to create a new custom map for this exact map extent using the uMap application.

![extension screenshot](https://images.rtijn.org/2025/chrome-extension-menu.png)


## To install

Right now, this is not an 'official' Chrome extension, you cannot download it from the Chrome Web Store. To install, clone this repo somewhere, open the Chrome extensions settings (Menu -> Extensions -> Manage Extensions or type `chrome://extensions/` in your browser), enable Developer Mode, select `Load Unpacked` and select the `chrome/` directory in the cloned repo.

## To contribute

If there is a tool you would like to add to this list, open `[popup.js](chrome/popup.js)` and add a new entry in the `tools` object. You will find detailed instructions in the file.

Please submit a pull request with your modified code and share your improvements with the community!

## Notes

- This extension is a very basic re-implementation of the [existing](https://chromewebstore.google.com/detail/osm-smart-menu/icipmdhgbkejfideagkhdebiaeohfijk) `OSM Smart Menu` extension, which is not supported and [does not seem to have an active maintainer](https://github.com/jgpacker/osm-smart-menu/issues/220).

- The logo is derived from those created by the [OSM Berlin](https://github.com/osmberlin/logos) project, [licensed](https://github.com/osmberlin/logos/blob/main/LICENSE) Creative Commons Zero v1.0 Universal.
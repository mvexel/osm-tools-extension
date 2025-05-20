# OpenStreetMap Tools Extension

## We are on Sourcehut
If you are reading this notice on Github, please point your bookmarks and git remotes at the `osm-tools-extension` repo [on Sourcehut](https://git.sr.ht/~mvexel/osm-tools-extension) instead. This project will not be updated on Github.

---


This Chrome / Firefox extension give you easy access to OSM tools based on the OSM map extent currently shown in in your active web browser tab. For example, if you are currently looking at [the OSM map around Manila](https://www.openstreetmap.org/#map=12/14.6208/121.0470), you can click on the extension icon and click on `New uMap here` to create a new custom map for this exact map extent using the uMap application.

![extension screenshot](https://images.rtijn.org/2025/chrome-extension-menu.png)

*There are other browser extensions out there that have more functionality, notably [OpenSwitchMaps](https://github.com/tankaru/OpenSwitchMaps). I made this to be simple and single-purpose, with source code that is easy to inspect.*

## To install

### Chrome
Right now, this is not an 'official' Chrome extension, you cannot download it from the Chrome Web Store.

#### Temporary Install
To install, clone this repo somewhere, open the Chrome extensions settings (`Menu -> Extensions -> Manage Extensions` or type `chrome://extensions/` in your browser), enable Developer Mode, select `Load Unpacked` and select the `chrome/` directory in the cloned repo.

### Firefox
You can find this extension in the [Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/osm-tools-quick-access/). (If this link does not work, the extension is probably under review).

#### Temporary Install
Right now, this is not an 'official' Firefox extension, you cannot download it from the Firefox Add-ons Store. To install, clone this repo somewhere, open the Firefox extensions settings (`Menu -> Add-ons -> Manage Extensions` or type `about:debugging` in your browser), enable Developer Mode, select `Load Temporary Add-on` and select the `firefox/` directory in the cloned repo.

## To contribute
If there is a tool you would like to add to the default list, open [`defaults.js`](chrome/defaults.js) and add a new entry in the `defaultTools` object. You will find detailed instructions in the file.

Please submit a pull request with your modified code and share your improvements with the community!

If that sounds too difficult, you can also open an issue and tell me what tool you would like to see included in the default list.

## Notes

- This extension is a very basic re-implementation of the [existing](https://chromewebstore.google.com/detail/osm-smart-menu/icipmdhgbkejfideagkhdebiaeohfijk) `OSM Smart Menu` extension, which is not supported and [does not seem to have an active maintainer](https://github.com/jgpacker/osm-smart-menu/issues/220).

- The logo is derived from those created by the [OSM Berlin](https://github.com/osmberlin/logos) project, [licensed](https://github.com/osmberlin/logos/blob/main/LICENSE) Creative Commons Zero v1.0 Universal.

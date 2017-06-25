# Timer for Websites That Steal Your Time

This project helps to control time was spent on sites. It requires special extension for Chrome browser.

# Installing

[TODO]

Open configuration of [cjs](https://chrome.google.com/webstore/detail/custom-javascript-for-web/poakhlngfciodnhlhhgnaaelnpjljija) browser extension on the site you want to controll. Click on the link "your own external scripts", add path [TODO в качестве production хостинга файла с JavaScript подойдет GitHub - у каждого файла в репозитории есть свой URL, и этим можно воспользоваться]. Don`t forget to press "enable cjs for this host" to enable custom JS.

For faster development you can use JS code hosted on localhost. Simple web server can be used for that, run:

```bash

python3 -m http.server
```

Add path `http://localhost:8000/index.js` to [cjs](https://chrome.google.com/webstore/detail/custom-javascript-for-web/poakhlngfciodnhlhhgnaaelnpjljija) browser extension. Done.


# Project Goals

The code is written for educational purposes. Training course for web-developers - [DEVMAN.org](https://devman.org)

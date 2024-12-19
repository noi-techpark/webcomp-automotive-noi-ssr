<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# NOI Automotive

[![REUSE Compliance](https://github.com/noi-techpark/webcomp-automotive-noi/actions/workflows/reuse.yml/badge.svg)](https://github.com/noi-techpark/odh-docs/wiki/REUSE#badges)

## Usage

Include the webcompscript file in your HTML and define the web component like this:

```html
<noi-automotive
    custom-links="" 
    default-company="" 
    default-category="" 
    limit-to-default-category="false" 
    visible-categories="" 
    language="en" 
    primary-color="#0000ff" 
    show-home-view="true" 
    website-mode="true" 
    width="1200px" 
    height="675px">
</noi-automotive>
```

### Individualisation (both website and webcomponent)

#### API_ENDPOINT
URL to the backend
Only change this if you're using you're own backend server

> Default: "https://bk.opendatahub.com"

#### API_COMPANIES_PATH
URL that get's appended to `API_ENDPOINT` when requesting companies
Only change this if you're using you're own backend server

> Default: "/api/published-noi-companies/"

#### NETWORK
defines from which network the app should load the profiles/companies

> Default "noi"

#### HEADER_LOGO_URL
Replaces the standard NOI Logo to a custom one. The new one should be 100px high and preferably with a transparent background.

#### SEARCHBAR_BACKGROUND
Replaces the standard background image of the searchbar. The size doesn't really matter since the background is set to cover the whole searchbar.
Hint: right click on the current image and open the image in a new tab. You'll see that the whole image is actually a square

#### PRIMARY_COLOR
Set the primary color. The value should be valid hexcode e.g. #0000ff

#### HIDDEN_FILTERS
Declare which filters should be hidden from the user. The value should be a comma-seperated list e.g. `specialization_area,industrial_sector,turnover`
possible values are: 

- specializationArea
- industrialSector
- valueChainPosition
- employees
- turnover
- certifications

#### VISIBLE_SPECIALIZATION_AREAS
Declare which specialization Areas should be visible. The value should be a comma-seperated list. If this variable is not set, all specialization Areas are visible.
possible values are: 
- automotive & mobility
- manufacturing
- agri-automation

### Attributes

#### language
Sets the language of the webcomponenent. (The user can change it later via the language Selector)

> Type: string<br>
> Options: "en", "de", "it"<br>
> Default: "en"

#### website-mode
Affects currently only two things: 
1. Wether the language Selector is displayed or not
2. In the case that [`custom-links`](#custom-links) is empty, adds a link to [NOI's privacy and cookie policy](https://noi.bz.it/en/privacy-cookie-policy)

> Type: Boolean<br>
> Default: false

#### default-company
If this attribute is set, the webcomponent will load the profile of the given company id

> Type: Number<br>
> Default: 0

Note: To get the id, you have to go to the [sectorial Overview](https://automotive.noi.bz.it), search for your company, and copy the id from the url

#### default-category
If this attribute is set, the webcomponent will directly select a category. The user is still able to go back and select another category, unless [`limit-to-default-category`](#limit-to-default-category) is `true`

> Type: String <br>
> Options: "automotiveAndMobility", "manufacturing", "agriAutomation"<br>
> Default: ""

#### limit-to-default-category
If `limit-to-default-category` is `true` the user won't be able to choose another category.

> Type: Boolean <br>
> Default: false

#### visible-categories
Filters all companies according to this array. If even one category matches, the company will be shown.
The string should be in the format of `Array.toString()`, meaning something like this `"automotiveAndMobility,manufacturing,agriAutomation"`

> Type: String<br>
> Default: ""

Note: Any redundant whitespaces will be ignored (using `trim()`). Furthermore, the check is case-insensitive.<br>
**If no categories were found in the string, it will default to show all categories.**

#### custom-links
Adds custom links to the footer.
The string must be a json array

> Type: Array (JSON) <br>
> Default: ""

Example: 
```json
[{"label": "NOI - Homepage", "url": "https://noi.bz.it"}, {"label": "Open Data Hub", "url": "opendatahub.bz.it"}]
```

#### primary-color
Color of map markers/clusters, search button, ...
must be either a hexcolor in full form (e.g. `#0033FF`) or shorthand form (e.g. `#03F`)

> Type: String <br>
> Default: `#0000ff`

#### width
width of the webcomponent. Because the string gets directly inserted as a css-value, it's possible to use functions like `calc()`

> Type: String<br>
> Default: 1200px

#### height
height of the webcomponent. Because the string gets directly inserted as a css-value, it's possible to use functions like ``calc()`

> Type: String<br>
> Default: 675px

#### show-home-view
If `show-home-view` is false, the webcomponent will hide the homeview (the startpage, which gives a small description about the sectorial overview)

> Type: Boolean<br>
> Default: true

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

### `webcomponent`

To generate the web component:

```bash
# generate static project
$ npm run generate
```

Then you can find the exported web component under `/dist/nuxt-custom-elements`.

## REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:

```bash
pip install pre-commit
```

Then install the pre-commit hook via the config file by running:

```bash
pre-commit install
```

# typist.js

[**demonstration**](https://codepen.io/craigbuckler/full/eaLwVY) | [**GitHub**](https://github.com/craigbuckler/typist.js) | [**npm**](https://www.npmjs.com/package/htmltypist.js) | [**donate**](https://gum.co/OWTuG) | [@craigbuckler](https://twitter.com/craigbuckler) | [craigbuckler.com](https://craigbuckler.com/)

typist.js shows a typing effect which can be applied to any HTML element or parent element.

Please use the code as you wish. [Tweet me @craigbuckler](https://twitter.com/craigbuckler) if you find it useful and [donate toward development](https://gum.co/OWTuG) if you use it commercially.

* lightweight: 2,800 bytes of JavaScript, 160 bytes of optional CSS
* no external dependencies - works with any framework
* easy to configure from HTML
* works in all modern browsers
* progressively-enhanced to avoid failure in older browsers.


## Basic example

The page must load the CSS and JavaScript. It can be placed anywhere but, typically, the CSS is loaded in the `<head>` and the JS is loaded just before the closing `</body>` tag:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/htmltypist.js/dist/typist.css">
<script src="https://cdn.jsdelivr.net/npm/htmltypist.js/dist/typist.js"></script>
```

CDN URLs are shown above but you can also `npm i htmltypist.js` to install via npm and use a bundler.

To apply a typing effect to any element, add `class="typist"` to any element:

```html
<p class="typist">Type and retype this paragraph forever!</p>
```

A number of data attributes are available. For example, set `data-typist-repeat="1"` to type once only:

```html
<p class="typist" data-typist-repeat="1">This paragraph is typed once.</p>
```


## Multiple elements

When an element has two or more child elements, their text is typed in sequence:

```html
<p class="typist">
  <span>This is typed first.</span>
  <span>This is typed second.</span>
  <span>This is typed third.</span>
</p>
```

"This is typed" is consistent across all sentences so it is never deleted.


## JavaScript usage

typist.js can be dynamically applied in JavaScript by passing a single element to a new `Typist` object:

```js
new Typist( document.getElementById('myelement') );
```


## typist.js options

The following options can be set as HTML5 attributes on any child element or the parent to set across all child elements:

|HTML5 attribute|description|
|-|-|
|`class="typist"`|set element to type|
|`data-typist-repeat="N"`|repeat typing N times (default: repeat forever)|
|`data-typist-delay-start="M"`|delay typing for M milliseconds after the element is scrolled into view (0)|
|`data-typist-delay-type="M"`|pause for M milliseconds between each character (100)|
|`data-typist-delay-delete="M"`|pause for M milliseconds between delete keypresses (50)|
|`data-typist-delay-vary="F"`|randomly vary the typing speed (0.5 - characters are therefore typed between 50ms and 150ms)|
|`data-typist-delay-end="M"`|pause for M milliseconds before typing the next item (2000)|
|`data-typist-delete="N"`|0 to retain existing text where possible, 1 to delete all (0)|
|`data-typist-cursor="CLASS"`|cursor style CSS class (cursor)|
|`data-typist-cursor-show="N"`|0 for no cursor, 1 to show cursor until typing completes, 2 to show cursor forever (1)|
|`data-typist-sequence="NAME"`|type elements in page DOM order - each completes one animation before the next element is typed|

The following named sequence example types each list item in turn when the first is scrolled into view:

```html
<ul>
  <li class="typist" data-typist-repeat="1" data-typist-sequence="mylist">item one</li>
  <li class="typist" data-typist-repeat="1" data-typist-sequence="mylist">item two</li>
  <li class="typist" data-typist-repeat="1" data-typist-sequence="mylist">item three</li>
</ul>
```

The following code types text three times using a delay of 300-500ms between characters once it appears in view:

```html
<p
  class="typist"
  data-typist-repeat="3"
  data-typist-delay-type="400"
  data-typist-delay-vary="0.25">This will be typed.</p>
```


## CSS options

typist.css is optional and only required for the cursor character and animation which can be configured as necessary.

A typist class is applied to all elements being typed, so global styles can be applied if required.


## Usage notes

1. Default settings can be changed in the propDefault variable.
1. Older browsers (IE11 and below) show all text and do not animate.


## Version history

### v2.0.0, 20 June 2019

* typing factors can be overridden on child elements
* new deletion delay
* improved performance, only types when in view
* removed IE support
* simpler to use, but incompatible with v1.x

### v1.1.0, 4 June 2019

* improved loading and IntersectionObserver
* reduced file size

### v1.0.1, 30 May 2019

* initial release

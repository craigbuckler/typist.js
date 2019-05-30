# typist.js

[**demonstration**](https://codepen.io/craigbuckler/full/eaLwVY) | [**@craigbuckler**](https://twitter.com/craigbuckler) | [**craigbuckler.com**](https://craigbuckler.com/)

typist.js shows a typing effect which can be applied to any HTML element or parent element.

Please use the code as you wish - [tweet me @craigbuckler](https://twitter.com/craigbuckler) if you find it useful.

* lightweight: 2,600 bytes of JavaScript, 245 bytes of CSS
* no external dependencies - works with any framework
* easy to configure from HTML or JavaScript
* works in all modern browsers (IE11+)
* progressively-enhanced to avoid failure in older browsers.


## Basic example

The page must load the CSS and JavaScript. It can be placed anywhere on the page but, typically, the CSS is loaded in the `<head>` and the JS is loaded just before the closing `</body>` tag:

```html
<link rel="stylesheet" href="dist/typist.css">
<script src="dist/typist.js"></script>
```

*(A module bundler can also be used.)*

To apply a typing effect to any element, add a `data-typist` attribute:

```html
<p data-typist="">Type and retype this paragraph forever!</p>
```

Pass a numeric value to the attribute to retype that number of times:

```html
<p data-typist="1">This paragraph is typed once.</p>
```


## Multiple elements

When an element has two or more child elements, their text is typed in sequence:

```html
<p data-typist="">
  <span>This is typed first.</span>
  <span>This is typed second.</span>
  <span>This is typed third.</span>
</p>
```

"This is typed" is consistent across all sentences so it is never deleted.


## JavaScript usage

typist.js can be dynamically applied in JavaScript by passing a single element in an option object:

```js
new Typist({
  element: document.getElementById('myelement')
});
```


## typist.js options

The following options can be set as HTML5 attributes or JavaScript object options:

|HTML5 attribute|JS object option|description|
|-|-|-|
|`data-typist=""`|`element: node`|set element(s) to type|
|`data-typist="N"`|`typist: N`|repeat typing N times. Omit to repeat forever (the default).|
|`data-cursor="N"`|`cursor: N`|set 0 for no cursor, 1 to show cursor until typing completes, or 2 to show cursor forever (default 1)|
|`data-delay-start="N"`|`delayStart: N`|delay typing for N milliseconds or pass -1 to delay typing until the element is scrolled into view (default 0)|
|`data-delay-end="N"`|`delayEnd: N`|pause for N milliseconds before typing the next item (default 2000)|
|`data-delay-type="N"`|`delayType: N`|pause for N milliseconds between each character (default 80)|
|`data-delay-variance="N"`|`delayVariance: N`|randomly vary the typing speed by N milliseconds (default 50 - each character therefore appears at 30ms to 130ms intervals)|
|`data-sequence="NAME"`|`delaySequence: NAME`|elements with the same NAME are typed in order - each will complete one animation before the next element is typed|

The following named sequence example types each list item in turn when the first is scrolled into view:

```html
<ul>
  <li data-typist="1" data-sequence="mylist" data-delay-start="-1">item one</li>
  <li data-typist="1" data-sequence="mylist">item two</li>
  <li data-typist="1" data-sequence="mylist">item three</li>
</ul>
```

The following code segments have the same result; an item is typed three times using a delay of 300-500ms between characters once it appears in view:

```html
<p
  data-typist="3"
  data-delay-start="-1"
  data-delay-type="400"
  data-delay-variance="100">This will be typed.</p>
```

Alternatively:

```html
<p id="myelement">This will be typed.</p>
<script>
new Typist({
  element: document.getElementById('myelement'),
  typist: 3,
  delayStart: -1,
  delayType: 400,
  delayVariance: 100
});
</script>
```

## CSS options

typist.css is optional and only required for the cursor character and animation which can be configured as necessary.

A typist class is applied to all elements being typed, so global styles can be applied if required.


## Usage notes

1. Default settings can be changed in the init variable.
1. Older browsers (IE10 and below) show all text and do not animate.
1. IE11 does not support data-sequence names and data-delay-start="-1" to animate when in view.

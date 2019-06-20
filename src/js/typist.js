/*
typist.js
by Craig Buckler, @craigbuckler

Add class="typist" to any element to type text in child nodes.

<p class="typist">
  <span>This is typed first</span>
  <span>This is typed second</span>
</p>

Typing animation only occurs when the element is in view.

Optional attributes can be applied to any child element or the parent element to set all defaults:

  data-typist-repeat="N"        - repeat typing N times (default: repeat forever)
  data-typist-delay-start="M"   - delay before typing (0 milliseconds)
  data-typist-delay-type="M"    - delay between keypresses (100 ms)
  data-typist-delay-delete="M"  - delay between deletes (50 ms)
  data-typist-delay-vary="F"    - delay typing variation (0.5 - typing is therefore between 50 and 150 ms)
  data-typist-delay-end="M"     - delay after typing (2000 ms)
  data-typist-delete="N"        - 0 = retain existing text where possible, 1 = delete all (0)
  data-typist-cursor="CLASS"    - cursor class name (cursor)
  data-typist-cursor-show="N"   - 0 = never show cursor, 1 = show cursor while typing, 2 = always show (1)
  data-typist-sequence="NAME"   - type elements in page DOM order
*/
(function() {

  'use strict';

  if (!window.addEventListener || !window.requestAnimationFrame || !window.IntersectionObserver || !window.CustomEvent) return;

  var

    // defaults
    name = 'typist',
    propDefault = [
      ['repeat', Infinity],   // repeat for
      ['sequence', null],     // sequence name
      ['cursor', 'cursor'],   // cursor class
      ['cursorShow', 1],      // 0 - no cursor, 1 - show while typing, 2 - show at end
      ['delete', 0],          // 0 - smart delete, 1 - delete all
      ['delayStart', 0],      // delay before typing
      ['delayType', 100],     // typing delay
      ['delayDelete', 50],    // deleting delay
      ['delayVary', 0.5],     // typing variance
      ['delayEnd', 2000]      // end typing delay
    ],

    // intersection observer
    observer = new function() {

      var
        io = null,
        element = [];

      // observe element
      this.observe = function(e) {
        if (io) io.observe(e);
        else element.push(e);
      };

      // unobserve element
      this.unobserve = function(e) {
        if (io) io.unobserve(e);
        else element = element.filter(function(a) { return a !== e; });
      };

      window.addEventListener('load', function() {

        // intersection observer created after window load
        io = new IntersectionObserver(

          function(entries) {

            entries.forEach(function(entry) {

              var r = entry.intersectionRatio;
              if (r > 0 && r < 1) return;

              // trigger event when element is in view
              var event = new CustomEvent('typist', { detail: {
                element: entry.target,
                inview: !!r
              }});

              document.dispatchEvent(event);

            });

          },
          { threshold: [0, 1] }

        );

        // observe elements
        var e;
        while ((e = element.shift())) io.observe(e);

      }, false);

    };


  // typist object
  var Typist = function(element) {

    if (!element || element.nodeType !== 1 || !element.dataset || element.dataset[name]) return;

    var T = this;

    // main properties
    element.dataset[name] = 1;
    getProp(element, T);

    // text properties
    T.element = element;
    T.text = getText();
    if (!T.text.length) return;

    // initialise
    T.element.innerHTML = '';
    T.active = false; // animation is active
    T.inview = false; // element fully in view
    T.item = 0;       // text item number
    T.chr = 0;        // character number
    T.dir = 1;        // text direction

    // element in view or in sequence
    document.addEventListener('typist', function(e) {

      // not this element?
      var d = e.detail;

      if ((d.element && d.element !== T.element) || (d.sequence && d.sequence !== T.sequence)) return;

      if (typeof d.inview !== 'undefined') T.inview = d.inview;

      if (!T.active && seqFirst()) {

        // show cursor
        if (T.cursorShow) T.element.classList.add(T.cursor);

        // start typing
        T.go();
      }

    }, false);


    // observe element
    observer.observe(T.element);

    // return first node in sequence
    function seqFirst() {
      return T.sequence ? T.element === document.querySelector('[data-typist-sequence="' + T.sequence + '"]') : true;
    }

    // get properties
    function getProp(emt, obj) {

      propDefault.forEach(function(prop) {
        var p = prop[0];
        obj[p] = emt.dataset[name + p.substring(0, 1).toUpperCase() + p.substring(1)];
        if (typeof obj[p] === 'undefined') obj[p] = T[p] || prop[1];
        if (!isNaN(obj[p])) obj[p] = +obj[p];
      });

    }

    // fetch text items to type
    function getText() {

      var text = [], child = T.element.children, e;

      for (e = 0; e < child.length; e++) addText(child[e]);
      if (!text.length) addText(T.element);

      return text.length ? text : null;

      function addText(e) {
        var t = { str: e.textContent.trim() };
        if (t.str) {
          getProp(e, t);
          text.push(t);
        }
      }

    }

  };


  // start typing
  Typist.prototype.go = function(startDelay) {

    var T = this;

    // element out of view?
    T.active = T.inview;
    if (!T.inview) return;

    var
      item = T.text[T.item],
      len = item.str.length,
      next = (T.item + 1) % T.text.length,
      delay = 0, str, event;

    // start delay
    if (!startDelay && item.delayStart && !T.chr && T.dir > 0) {
      setTimeout(function() { T.go(true); }, item.delayStart);
      return;
    }

    // next character
    T.chr += T.dir;
    if (!T.chr || T.chr >= len) T.dir *= -1;
    if (!T.chr) T.item = next;

    str = item.str.slice(0, T.chr);

    // start next item
    if (T.dir === -1 && T.text.length > 1 && !item.delete && !T.text[next].str.indexOf(str)) {
      T.item = next;
      T.dir = 1;
    }

    // typing delay
    if (T.chr >= len) {

      // end of sequence reached?
      if (item.repeat) item.repeat--;
      delay = item.repeat ? item.delayEnd : 0;

      // next in sequence
      if (T.sequence) {
        event = new CustomEvent('typist', { detail: { sequence: T.sequence }});
        T.sequence = null;
        T.element.removeAttribute('data-typist-sequence');
      }

    }
    else {

      // typing speed
      var delayFactor = T.dir > 0 ? item.delayType : item.delayDelete;
      delay = Math.max(1, Math.round((Math.random() - 0.5) * 2 * item.delayVary * delayFactor) + delayFactor);

    }

    requestAnimationFrame(function() {

      // update text
      T.element.textContent = str;

      // next animation or stop
      if (delay) setTimeout(function() { T.go(); }, delay);
      else {
        if (item.cursorShow === 1) T.element.classList.remove(T.cursor);
        observer.unobserve(T.element);
      }

      // sequence event
      if (event) document.dispatchEvent(event);

    });

  };


  // public object
  window.Typist = Typist;

  // apply Typist to HTML elements
  window.addEventListener('DOMContentLoaded', function() {

    var tE = document.getElementsByClassName(name);
    for (var t = 0; t < tE.length; t++) new Typist(tE[t]);

  }, false);

})();

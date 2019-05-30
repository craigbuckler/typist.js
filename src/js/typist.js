// typist.js
// by Craig Buckler, @craigbuckler

window.Typist = window.Typist || function(){};

(function() {

  'use strict';

  if (!window.addEventListener || !window.requestAnimationFrame) return;

  var
    // defaults
    init = {
      element:        '[data-typist]',
      cls:            'typist',
      clsCursor:      'cursor',
      cursor:         1,                // 0 - no cursor, 1 - show while typing, 2 - show at end
      delayStart:     0,                // milliseconds or -N to start when in view
      delayType:      80,
      delayVariance:  50,
      delayEnd:       2000,
      viewThreshold:  1
    },
    // intersection observer
    observer = (window.IntersectionObserver && window.CustomEvent) ? new IntersectionObserver(

      function(entries) {

        entries.forEach(function(entry) {

          if (entry.intersectionRatio < init.viewThreshold) return;

          // trigger event when element is in view
          var event = new CustomEvent('typist', { detail: { element: entry.target }});
          document.dispatchEvent(event);

        });

      },
      { threshold: init.viewThreshold }

    ) : null;


  // typist object
  var Typist = function(arg) {

    var T = this;
    arg = arg || {};

    // get element
    T.element = arg.element || null;
    if (!T.element || T.element.nodeType !== 1 || !T.element.dataset || T.element.classList.contains(init.cls)) return;

    // set defaults
    T.text = T.getText();
    if (!T.text.length) return;

    var ds = T.element.dataset;
    T.repeat = parseFloat(arg.typist || ds.typist) || Infinity;
    T.cursor = parseFloat(arg.cursor || ds.cursor) || init.cursor;
    T.sequence = observer ? arg.sequence || ds.sequence : null;

    T.delayStart = parseFloat(arg.delayStart || ds.delayStart) || init.delayStart;
    T.delayType = parseFloat(arg.delayType || ds.delayType) || init.delayType;
    T.delayEnd = parseFloat(arg.delayEnd || ds.delayEnd) || init.delayEnd;
    T.delayVariance = parseFloat(arg.delayVariance || ds.delayVariance) || init.delayVariance;

    // initialise
    T.element.innerHTML = '';
    T.element.classList.add(init.cls);
    T.item = 0;
    T.char = 0;
    T.dir = 1;

    // start typing
    if (!observer || (T.delayStart >= 0 && !T.sequence)) T.start();
    else {

      // wait until element is in view
      observer.observe(T.element);

      // element in view
      document.addEventListener('typist', function(e) {

        if (
          (!T.sequence && e.detail.element === T.element) ||
          document.querySelector('[data-sequence="' + T.sequence + '"]') === T.element
        ) {

          observer.unobserve(T.element);
          T.start();

        }
      }, false);

    }

  };


  // start typing
  Typist.prototype.start = function() {

    var T = this;

    if (T.started) return;
    T.started = true;

    setTimeout(function() {
      if (T.cursor > 0) T.element.classList.add(init.clsCursor);
      T.typeText();
    }, T.delayStart > 0 ? T.delayStart : 1);

  };


  // type text
  Typist.prototype.typeText = function() {

    var
      T = this,
      txt = T.text[T.item],
      len = txt.length,
      next = (T.item + 1) % T.text.length,
      delay = 0, str;

    T.char += T.dir;

    if (!T.char || T.char >= len) T.dir *= -1;
    if (!T.char) T.item = next;

    str = txt.slice(0, T.char);

    if (T.dir === -1 && T.text.length > 1 && !T.text[next].indexOf(str)) {
      T.item = next;
      T.dir = 1;
    }

    // typing delay
    if (T.char >= len) {

      // end of sequence reached?
      if (!next) T.repeat--;
      delay = T.repeat ? T.delayEnd : 0;
      if (T.sequence) {
        var event = new CustomEvent('typist', { detail: { sequence: T.sequence }});
        T.sequence = null;
        T.element.removeAttribute('data-sequence');
        document.dispatchEvent(event);
      }

    }
    else if (T.dir > 0) delay = Math.random() * (T.delayVariance * 2) - T.delayVariance + T.delayType;
    else delay = T.delayType - T.delayVariance;

    // show text
    requestAnimationFrame(function() {

      T.element.textContent = str;
      if (delay) setTimeout(function() { T.typeText(); }, delay);
      else if (T.cursor === 1) T.element.classList.remove(init.clsCursor);

    });

  };


  // fetch text items to type
  Typist.prototype.getText = function() {

    var text = [], child = this.element.children, e;

    for (e = 0; e < child.length; e++) addText(child[e]);
    if (!text.length) addText(this.element);

    return text.length ? text : null;

    function addText(e) {
      var t = e.textContent.trim();
      if (t) text.push(t);
    }

  };


  // public object
  window.Typist = Typist;

  // apply Typist to HTML elements
  window.addEventListener('DOMContentLoaded', function() {

    var typistElement = document.querySelectorAll(init.element);
    for (var t = 0; t < typistElement.length; t++) new Typist({ element: typistElement[t] });

  }, false);

})();

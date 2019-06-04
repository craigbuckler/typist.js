// typist.js
// by Craig Buckler, @craigbuckler

window.Typist = window.Typist || function(){};

(function() {

  'use strict';

  var w = window, wa = w.addEventListener, d = document;

  if (!wa || !w.requestAnimationFrame) return;

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

    // intersection observer object
    observer = (!w.IntersectionObserver || !w.CustomEvent) ? null : new function() {

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

      wa('load', function() {

        // intersection observer created after window load
        io = new IntersectionObserver(

          function(entries) {

            entries.forEach(function(entry) {

              if (entry.intersectionRatio < init.viewThreshold) return;

              // trigger event when element is in view
              var event = new CustomEvent('typist', { detail: { node: entry.target }});
              d.dispatchEvent(event);

            });

          },
          { threshold: init.viewThreshold }

        );

        // observe elements
        var e;
        while ((e = element.shift())) io.observe(e);

      }, false);

    };


  // typist object
  var Typist = function(arg) {

    var T = this;
    arg = arg || {};

    // get element
    T.node = arg.element || null;
    T.cl = T.node && T.node.classList;
    if (!T.node || T.node.nodeType !== 1 || !T.node.dataset || T.cl.contains(init.cls)) return;

    // set defaults
    T.text = getText();
    if (!T.text.length) return;

    var ds = T.node.dataset;
    T.rep = 1 * (arg.typist || ds.typist) || Infinity;
    T.cur = 1 * (arg.cursor || ds.cursor) || init.cursor;
    T.seq = observer ? arg.sequence || ds.sequence : null;

    T.dS = 1 * (arg.delayStart || ds.delayStart) || init.delayStart;
    T.dT = 1 * (arg.delayType || ds.delayType) || init.delayType;
    T.dE = 1 * (arg.delayEnd || ds.delayEnd) || init.delayEnd;
    T.dV = 1 * (arg.delayVariance || ds.delayVariance) || init.delayVariance;

    // initialise
    T.node.innerHTML = '';
    T.cl.add(init.cls);
    T.i = 0;  // item number
    T.c = 0;  // character number
    T.d = 1;  // text direction

    // start typing?
    if (!observer || (T.dS >= 0 && !T.seq)) T.start();
    else {

      // wait until element is in view
      if (T.dS < 0 || T.node === seqFirst()) observer.observe(T.node);

      // element in view or in sequence
      d.addEventListener('typist', function(e) {

        if (e.detail.node === T.node || (T.seq === e.detail.seq && T.node === seqFirst())) {

          observer.unobserve(T.node);
          T.start();

        }
      }, false);

    }

    // return first node in sequence
    function seqFirst() {
      return T.seq ? d.querySelector('[data-sequence="' + T.seq + '"]') : 0;
    }

    // fetch text items to type
    function getText() {

      var text = [], child = T.node.children, e;

      for (e = 0; e < child.length; e++) addText(child[e]);
      if (!text.length) addText(T.node);

      return text.length ? text : null;

      function addText(e) {
        var t = e.textContent.trim();
        if (t) text.push(t);
      }

    }

  };


  // start typing
  Typist.prototype.start = function() {

    var T = this;

    setTimeout(function() {
      if (T.cur > 0) T.cl.add(init.clsCursor);
      typeText();
    }, Math.max(1, T.dS));


    // type text
    function typeText() {

      var
        txt = T.text[T.i],
        len = txt.length,
        next = (T.i + 1) % T.text.length,
        delay = 0, str;

      T.c += T.d;

      if (!T.c || T.c >= len) T.d *= -1;
      if (!T.c) T.i = next;

      str = txt.slice(0, T.c);

      if (T.d === -1 && T.text.length > 1 && !T.text[next].indexOf(str)) {
        T.i = next;
        T.d = 1;
      }

      // typing delay
      if (T.c >= len) {

        // end of sequence reached?
        if (!next) T.rep--;
        delay = T.rep ? T.dE : 0;
        if (T.seq) {
          var event = new CustomEvent('typist', { detail: { seq: T.seq }});
          T.seq = null;
          T.node.removeAttribute('data-sequence');
          d.dispatchEvent(event);
        }

      }
      else if (T.d > 0) delay = Math.random() * (T.dV * 2) - T.dV + T.dT;
      else delay = T.dT - T.dV;

      // show text
      requestAnimationFrame(function() {

        T.node.textContent = str;
        if (delay) setTimeout(typeText, delay);
        else if (T.cur === 1) T.cl.remove(init.clsCursor);

      });

    }

  };


  // public object
  w.Typist = Typist;

  // apply Typist to HTML elements
  wa('DOMContentLoaded', function() {

    var typistElement = d.querySelectorAll(init.element);
    for (var t = 0; t < typistElement.length; t++) new Typist({ element: typistElement[t] });

  }, false);

})();

window.Typist=window.Typist||function(){},function(){'use strict';var e=window,t=e.addEventListener,n=document;if(t&&e.requestAnimationFrame){var r={element:'[data-typist]',cls:'typist',clsCursor:'cursor',cursor:1,delayStart:0,delayType:80,delayVariance:50,delayEnd:2e3,viewThreshold:1},d=e.IntersectionObserver&&e.CustomEvent?new function(){var e=null,d=[];this.observe=function(t){e?e.observe(t):d.push(t)},this.unobserve=function(t){e?e.unobserve(t):d=d.filter(function(e){return e!==t})},t('load',function(){var t;for(e=new IntersectionObserver(function(e){e.forEach(function(e){if(!(e.intersectionRatio<r.viewThreshold)){var t=new CustomEvent('typist',{detail:{node:e.target}});n.dispatchEvent(t)}})},{threshold:r.viewThreshold});t=d.shift();)e.observe(t)},!1)}:null,o=function(e){var t=this;if(e=e||{},t.node=e.element||null,t.cl=t.node&&t.node.classList,t.node&&1===t.node.nodeType&&t.node.dataset&&!t.cl.contains(r.cls)&&(t.text=function(){var e,n=[],r=t.node.children;for(e=0;e<r.length;e++)d(r[e]);n.length||d(t.node);return n.length?n:null;function d(e){var t=e.textContent.trim();t&&n.push(t)}}(),t.text.length)){var o=t.node.dataset;t.rep=1*(e.typist||o.typist)||1/0,t.cur=1*(e.cursor||o.cursor)||r.cursor,t.seq=d?e.sequence||o.sequence:null,t.dS=1*(e.delayStart||o.delayStart)||r.delayStart,t.dT=1*(e.delayType||o.delayType)||r.delayType,t.dE=1*(e.delayEnd||o.delayEnd)||r.delayEnd,t.dV=1*(e.delayVariance||o.delayVariance)||r.delayVariance,t.node.innerHTML='',t.cl.add(r.cls),t.i=0,t.c=0,t.d=1,!d||t.dS>=0&&!t.seq?t.start():((t.dS<0||t.node===s())&&d.observe(t.node),n.addEventListener('typist',function(e){(e.detail.node===t.node||t.seq===e.detail.seq&&t.node===s())&&(d.unobserve(t.node),t.start())},!1))}function s(){return t.seq?n.querySelector('[data-sequence="'+t.seq+'"]'):0}};o.prototype.start=function(){var e=this;function t(){var d,o=e.text[e.i],s=o.length,i=(e.i+1)%e.text.length,a=0;if(e.c+=e.d,(!e.c||e.c>=s)&&(e.d*=-1),e.c||(e.i=i),d=o.slice(0,e.c),-1===e.d&&e.text.length>1&&!e.text[i].indexOf(d)&&(e.i=i,e.d=1),e.c>=s){if(i||e.rep--,a=e.rep?e.dE:0,e.seq){var l=new CustomEvent('typist',{detail:{seq:e.seq}});e.seq=null,e.node.removeAttribute('data-sequence'),n.dispatchEvent(l)}}else a=e.d>0?Math.random()*(2*e.dV)-e.dV+e.dT:e.dT-e.dV;requestAnimationFrame(function(){e.node.textContent=d,a?setTimeout(t,a):1===e.cur&&e.cl.remove(r.clsCursor)})}setTimeout(function(){e.cur>0&&e.cl.add(r.clsCursor),t()},Math.max(1,e.dS))},e.Typist=o,t('DOMContentLoaded',function(){for(var e=n.querySelectorAll(r.element),t=0;t<e.length;t++)new o({element:e[t]})},!1)}}();
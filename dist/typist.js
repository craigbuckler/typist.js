window.Typist=window.Typist||function(){},function(){'use strict';if(window.addEventListener&&window.requestAnimationFrame){var e='[data-typist]',t='typist',n='cursor',a=1,r=0,i=80,s=50,l=2e3,d=1,o=window.IntersectionObserver&&window.CustomEvent?new IntersectionObserver(function(e){e.forEach(function(e){if(!(e.intersectionRatio<d)){var t=new CustomEvent('typist',{detail:{element:e.target}});document.dispatchEvent(t)}})},{threshold:d}):null,c=function(e){var n=this;if(e=e||{},n.element=e.element||null,n.element&&1===n.element.nodeType&&n.element.dataset&&!n.element.classList.contains(t)&&(n.text=n.getText(),n.text.length)){var d=n.element.dataset;n.repeat=parseFloat(e.typist||d.typist)||1/0,n.cursor=parseFloat(e.cursor||d.cursor)||a,n.sequence=o?e.sequence||d.sequence:null,n.delayStart=parseFloat(e.delayStart||d.delayStart)||r,n.delayType=parseFloat(e.delayType||d.delayType)||i,n.delayEnd=parseFloat(e.delayEnd||d.delayEnd)||l,n.delayVariance=parseFloat(e.delayVariance||d.delayVariance)||s,n.element.innerHTML='',n.element.classList.add(t),n.item=0,n.char=0,n.dir=1,!o||n.delayStart>=0&&!n.sequence?n.start():(o.observe(n.element),document.addEventListener('typist',function(e){(!n.sequence&&e.detail.element===n.element||document.querySelector('[data-sequence="'+n.sequence+'"]')===n.element)&&(o.unobserve(n.element),n.start())},!1))}};c.prototype.start=function(){var e=this;e.started||(e.started=!0,setTimeout(function(){e.cursor>0&&e.element.classList.add(n),e.typeText()},e.delayStart>0?e.delayStart:1))},c.prototype.typeText=function(){var e,t=this,a=t.text[t.item],r=a.length,i=(t.item+1)%t.text.length,s=0;if(t.char+=t.dir,(!t.char||t.char>=r)&&(t.dir*=-1),t.char||(t.item=i),e=a.slice(0,t.char),-1===t.dir&&t.text.length>1&&!t.text[i].indexOf(e)&&(t.item=i,t.dir=1),t.char>=r){if(i||t.repeat--,s=t.repeat?t.delayEnd:0,t.sequence){var l=new CustomEvent('typist',{detail:{sequence:t.sequence}});t.sequence=null,t.element.removeAttribute('data-sequence'),document.dispatchEvent(l)}}else s=t.dir>0?Math.random()*(2*t.delayVariance)-t.delayVariance+t.delayType:t.delayType-t.delayVariance;requestAnimationFrame(function(){t.element.textContent=e,s?setTimeout(function(){t.typeText()},s):1===t.cursor&&t.element.classList.remove(n)})},c.prototype.getText=function(){var e,t=[],n=this.element.children;for(e=0;e<n.length;e++)a(n[e]);return t.length||a(this.element),t.length?t:null;function a(e){var n=e.textContent.trim();n&&t.push(n)}},window.Typist=c,window.addEventListener('DOMContentLoaded',function(){for(var t=document.querySelectorAll(e),n=0;n<t.length;n++)new c({element:t[n]})},!1)}}();
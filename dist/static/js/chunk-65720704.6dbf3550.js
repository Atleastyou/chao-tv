(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-65720704","chunk-31631b6a","chunk-5e04f6b8"],{"05ba":function(t,e){var i="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(i){var n=new Uint8Array(16);t.exports=function(){return i(n),n}}else{var a=new Array(16);t.exports=function(){for(var t,e=0;e<16;e++)0===(3&e)&&(t=4294967296*Math.random()),a[e]=t>>>((3&e)<<3)&255;return a}}},"37ea":function(t,e,i){},"3c6b":function(t,e,i){"use strict";var n=i("a013"),a=i("b146"),r=i("b0f4"),s=i("35dd");i("629c")("match",1,function(t,e,i,o){return[function(i){var n=t(this),a=void 0==i?void 0:i[e];return void 0!==a?a.call(i,n):new RegExp(i)[e](String(n))},function(t){var e=o(i,t,this);if(e.done)return e.value;var c=n(t),l=String(this);if(!c.global)return s(c,l);var u=c.unicode;c.lastIndex=0;var d,f=[],m=0;while(null!==(d=s(c,l))){var v=String(d[0]);f[m]=v,""===v&&(c.lastIndex=r(l,a(c.lastIndex),u)),m++}return 0===m?null:f}]})},4964:function(t,e,i){"use strict";function n(t){if(Array.isArray(t)){for(var e=0,i=new Array(t.length);e<t.length;e++)i[e]=t[e];return i}}function a(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function r(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function s(t){return n(t)||a(t)||r()}i.d(e,"a",function(){return s})},5428:function(t,e,i){var n=i("05ba"),a=i("97c1");function r(t,e,i){var r=e&&i||0;"string"==typeof t&&(e="binary"===t?new Array(16):null,t=null),t=t||{};var s=t.random||(t.rng||n)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,e)for(var o=0;o<16;++o)e[r+o]=s[o];return e||a(s)}t.exports=r},"8a1f":function(t,e,i){"use strict";var n=i("f538"),a=i.n(n);a.a},"97c1":function(t,e){for(var i=[],n=0;n<256;++n)i[n]=(n+256).toString(16).substr(1);function a(t,e){var n=e||0,a=i;return[a[t[n++]],a[t[n++]],a[t[n++]],a[t[n++]],"-",a[t[n++]],a[t[n++]],"-",a[t[n++]],a[t[n++]],"-",a[t[n++]],a[t[n++]],"-",a[t[n++]],a[t[n++]],a[t[n++]],a[t[n++]],a[t[n++]],a[t[n++]]].join("")}t.exports=a},be15:function(t,e,i){"use strict";i.r(e);var n,a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"materials",staticClass:"material"},[i("infiniteScroll",{staticClass:"material-list",attrs:{loadMore:t.loadMore}},[t._l(t.list,function(e){return i("div",{staticClass:"material-item"},[i("div",{staticClass:"material-item-img",style:{"background-image":"url("+e.img+"?imageslim&imageView2/0/w/765)"},attrs:{id:e.id,type:"material"}}),i("div",{staticClass:"material-item-cell"},[i("div",{staticClass:"material-item-info"},[t._v("点击添加到画布…")]),i("div",{staticClass:"material-item-collection",on:{click:function(i){return i.stopPropagation(),t.collectionMaterial(e)}}},[e.is_collection?i("i",{staticClass:"icon-collection_active"}):i("i",{staticClass:"icon-collection"})])]),i("div",{staticClass:"material-item-btns"},[i("div",{staticClass:"material-item-btn",on:{click:function(i){return t.replaceImage(e.img)}}},[t._v("替换")]),i("div",{staticClass:"material-item-btn",on:{click:function(i){return t.addImage(e.img)}}},[t._v("添加")])])])}),t.list.length?t._e():i("div",{staticClass:"material-list-info"},[t._v("暂无收藏的素材")])],2)],1)},r=[],s=(i("f763"),i("608b"),i("3c6b"),i("4964")),o=(i("4453"),i("089b")),c=i("e20c"),l=i("880a"),u=i("fd88"),d=i("591a"),f=i("5428"),m=i.n(f),v={name:"materialStore",data:function(){return{list:[],pageCode:0,isLoading:!1,isLoaded:!1,collectionStatus:!1,eventList:{TOUCH_START:this.isMobile()?"touchstart":"mousedown",TOUCH_MOVE:this.isMobile()?"touchmove":"mousemove",TOUCH_END:this.isMobile()?"touchend":"mouseup"}}},components:{infiniteScroll:u["a"]},methods:Object(c["a"])({},Object(d["b"])(["changeSketchGoods","updateHistory"]),{collectionMaterial:function(){var t=Object(o["a"])(regeneratorRuntime.mark(function t(e){var i,n,a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,!this.collectionStatus){t.next=3;break}return t.abrupt("return");case 3:if(this.collectionStatus=!0,i=e.is_collection,n=e.id,!i){t.next=10;break}return t.next=8,this.$axios.get(l["unCollectionMaterial"],{params:{id:n}});case 8:t.next=12;break;case 10:return t.next=12,this.$axios.get(l["collectionMaterial"],{params:{id:n}});case 12:this.$set(e,"is_collection",!i),this.getSceneMaterials(),t.next=20;break;case 16:t.prev=16,t.t0=t["catch"](0),a=t.t0.msg,this.$toast.error(a);case 20:case"end":return t.stop()}},t,this,[[0,16]])}));function e(e){return t.apply(this,arguments)}return e}(),getSceneMaterials:function(){var t=Object(o["a"])(regeneratorRuntime.mark(function t(){var e,i,n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.$axios.get(l["getSceneMaterials"],{params:{is_collection:1,style:this.selectedStyle,space:this.selectedSpace}});case 3:e=t.sent,i=e.data,this.pageCode=i.page_code,this.list=i.ls,this.collectionStatus=!1,this.isLoaded=!1,t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](0),n=t.t0.msg,this.$toast.error(n);case 15:case"end":return t.stop()}},t,this,[[0,11]])}));function e(){return t.apply(this,arguments)}return e}(),loadMore:function(){var t=Object(o["a"])(regeneratorRuntime.mark(function t(){var e,i,n,a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,!this.isLoading&&!this.isLoaded){t.next=3;break}return t.abrupt("return");case 3:return this.isLoading=!0,t.next=6,this.$axios.get(l["getSceneMaterials"],{params:{is_collection:1,page_code:this.pageCode,style:this.selectedStyle,space:this.selectedSpace}});case 6:i=t.sent,n=i.data,(e=this.list).push.apply(e,Object(s["a"])(n.ls)),this.pageCode=n.page_code,this.isLoaded=!n.ls.length,this.isLoading=!1,t.next=19;break;case 14:t.prev=14,t.t0=t["catch"](0),a=t.t0.msg,this.isLoading=!1,this.$toast.error(a);case 19:case"end":return t.stop()}},t,this,[[0,14]])}));function e(){return t.apply(this,arguments)}return e}(),isMobile:function(){return!!(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i))},initDrag:function(){var t=this,e=new CustomEvent("mydragstart"),i=new CustomEvent("mydragend");this.$refs.materials.addEventListener(this.eventList.TOUCH_START,function(a){if(a.cancelable&&-1!==a.target.className.indexOf("material-item-img")){clearInterval(n);var r=500,s=t.isMobile()?a.changedTouches[0]:a,o=null,l=a.target,u=l.getBoundingClientRect(),d=!1,f=null;n=setTimeout(function(){window.dispatchEvent(e),o=l.cloneNode(!0),o.style.width=l.offsetWidth+"px",o.style.height=l.offsetHeight+"px",o.style.position="fixed",o.style.left=u.left+"px",o.style.top=u.top+"px",o.style.pointerEvents="none",o.style.transition="transform .3s",document.body.appendChild(o),setTimeout(function(){o.style.transform="scale(1.2)"},50);var i=function t(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,e.target.removeEventListener("click",t)},n=function(t){t.preventDefault()},a=function e(i){i.preventDefault(),i.target.removeEventListener(t.eventList.TOUCH_MOVE,n),i.target.removeEventListener(t.eventList.TOUCH_END,e)};l.addEventListener("click",i),l.addEventListener(t.eventList.TOUCH_MOVE,n),l.addEventListener(t.eventList.TOUCH_END,a)},r);var m=function(e){var i=t.isMobile()?e.changedTouches[0]:e;(Math.abs(i.clientX-s.clientX)>30||Math.abs(i.clientY-s.clientY)>30)&&clearInterval(n),requestAnimationFrame(function(){if(o){var i=t.isMobile()?e.changedTouches[0]:e,n=document.createEvent("Event");n.initEvent("myDragover",!0,!0),f=document.elementFromPoint(i.pageX,i.pageY),f&&f.dispatchEvent(n),d=n.defaultPrevented,o.style.left=Math.round(i.pageX-(s.pageX-u.left))+"px",o.style.top=Math.round(i.pageY-(s.pageY-u.top))+"px"}})};document.addEventListener(t.eventList.TOUCH_MOVE,m,{passive:!1}),document.addEventListener(t.eventList.TOUCH_END,function(e){if(clearInterval(n),document.removeEventListener(t.eventList.TOUCH_MOVE,m),o){if(d){var a=document.createEvent("Event");a.initEvent("myDrop",!0,!0);var r=t.isMobile()?e.changedTouches[0]:e,s=t.list.find(function(t){return parseInt(l.getAttribute("id"))===t.id});a["pageX"]=r.pageX,a["pageY"]=r.pageY,a["data"]=Object(c["a"])({type:l.getAttribute("type"),url:s.img},s),f.dispatchEvent(a)}document.body.removeChild(o),o=null,window.dispatchEvent(i)}})}})},handleDragEnd:function(t){window.dispatchEvent(window.mydragend),window.dragTarget=null},handleDragStart:function(t,e){t.dataTransfer.setData("type","material"),t.dataTransfer.setData("url",e.img),window.dispatchEvent(window.mydragstart)},replaceImage:function(t){var e=this,i=canvas.getActiveObjects();if(this.matrixShow)this.$toast.message("请先取消变形");else if(0!==i.length)if(i.length>1)this.$toast.message("只能替换单个素材");else if("i-text"!==i[0].type){var n=m()();canvas.getActiveObjects().forEach(function(t){t.goods_id&&e.changeSketchGoods({type:"remove",uid:t.uid}),canvas.remove(t)}),canvas.discardActiveObject().renderAll(),fabric.Image.fromURL(t+"?imageslim&imageView2/0/w/1000",function(t){var a=i[0].scaleX*i[0].width/t.width,r=Object(c["a"])({},i[0],{width:t.width,height:t.height,scaleX:a,scaleY:a,_element:t._element,_originalElement:t._originalElement,uid:n});r.goods_id&&delete r.goods_id,t.set(Object(c["a"])({},r)),canvas.add(t),canvas.setActiveObject(t),e.updateHistory()},{crossOrigin:"anonymous"})}else this.$toast.message("文本不能被替换");else this.$toast.message("请先选中被替换的素材")},addImage:function(t){var e=this,i=m()();fabric.Image.fromURL(t+"?imageslim&imageView2/0/w/1000",function(t){t.set({uid:i}),canvas.add(t),canvas.setActiveObject(t),e.updateHistory()},{crossOrigin:"anonymous"})}}),computed:Object(c["a"])({},Object(d["c"])({styleList:function(t){return t.sketch.styleList},spaceList:function(t){return t.sketch.spaceList},matrixShow:function(t){return t.sketch.matrix.show}})),created:function(){this.getSceneMaterials()},mounted:function(){this.initDrag()}},g=v,h=(i("8a1f"),i("17cc")),p=Object(h["a"])(g,a,r,!1,null,"4cdfcf08",null);e["default"]=p.exports},c2f0:function(t,e,i){"use strict";var n=i("37ea"),a=i.n(n);a.a},f538:function(t,e,i){},fd88:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"scroller",attrs:{id:"scroller"}},[t._t("default")],2)},a=[],r=(i("d4d5"),{name:"infiniteScroll",props:{distance:{type:Number,default:100},loadMore:{type:Function,required:!0}},methods:{initScroller:function(){var t=this,e=this.$refs.scroller;e.addEventListener("scroll",function(i){var n=e.scrollHeight,a=e.scrollTop,r=e.offsetHeight;n-a-r<100&&t.loadMore()})}},mounted:function(){this.initScroller()}}),s=r,o=(i("c2f0"),i("17cc")),c=Object(o["a"])(s,n,a,!1,null,"0355fe16",null);e["a"]=c.exports}}]);
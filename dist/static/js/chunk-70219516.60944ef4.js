(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-70219516"],{"08fd":function(t,e,c){"use strict";c.r(e);var s=function(){var t=this,e=t.$createElement,c=t._self._c||e;return c("div",{staticClass:"modify-pop-body"},[c("div",{staticClass:"goods-detail-img"},[c("div",{staticClass:"goods-photo"},[c("img",{attrs:{src:t.selectedSpec.spec_img||t.goods.original_img}})])]),c("div",{staticClass:"goods-detail-body"},[c("div",{staticClass:"icon-close",on:{click:t.close}}),c("div",{staticClass:"goods-price"},[t._v("¥"+t._s(t.selectedSpec.hasDiscount?t.selectedSpec.shop_price:t.selectedSpec.old_shop_price))]),c("div",{staticClass:"goods-spec-items"},t._l(t.goods.spec,function(e,s){return c("div",{staticClass:"spec-item"},[c("div",{staticClass:"spec-item-label"},[t._v(t._s(e.name)+"：")]),c("div",{staticClass:"spec-item-content"},t._l(e.spec_item,function(e,n){return c("div",{staticClass:"spec-item-value",class:{active:t.specKeysMap[s]==e.id},on:{click:function(c){return t.selectSpec(s,e.id)}}},[e.src?c("img",{attrs:{src:e.src}}):t._e(),c("span",[t._v(t._s(e.item))])])}),0)])}),0),c("div",{staticClass:"goods-detail-handle",on:{click:t.confirm}},[t._v("确认修改")])])])},n=[],o=(c("b745"),c("4964")),i=(c("608b"),c("3d92")),r=(c("f763"),c("7bc1"),{name:"specSelect",props:{goods:{type:Object,required:!0}},data:function(){return{selectedNumber:1,specKeysMap:[],selectedSpec:{spec_img:"",min_count:1,store_count:1}}},watch:{goods:function(){this.init()}},methods:{getSpecKeysMap:function(){var t=[],e=this.goods.selectedSpec.spec_key.split("_");this.goods.spec.forEach(function(c,s){for(var n=function(n){var o=c.spec_item[n];if(e.find(function(t){return parseInt(o.id)===parseInt(t)}))return t[s]=o.id,{v:!1}},o=0;o<c.spec_item.length;o++){var r=n(o);if("object"===Object(i["a"])(r))return r.v}}),this.specKeysMap=t},selectSpec:function(t,e){this.specKeysMap[t]=e;var c=Object(o["a"])(this.specKeysMap),s=c.sort(function(t,e){return t-e}).join("_");this.selectedSpec=this.goods.spec_value.find(function(t){return t.spec_key===s})},confirm:function(){this.selectedSpec.selectedNumber=this.selectedNumber,this.$emit("confirm",this.selectedSpec),this.close()},close:function(){this.$emit("close")}},created:function(){this.selectedSpec=this.goods.selectedSpec,this.getSpecKeysMap()}}),a=r,l=(c("09bc"),c("17cc")),u=Object(l["a"])(a,s,n,!1,null,"c4ba172e",null);e["default"]=u.exports},"09bc":function(t,e,c){"use strict";var s=c("b1d6"),n=c.n(s);n.a},"119c":function(t,e,c){"use strict";var s=c("b6f1");t.exports=function(t,e){return!!t&&s(function(){e?t.call(null,function(){},1):t.call(null)})}},"3d92":function(t,e,c){"use strict";function s(t){return s="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function n(t){return n="function"===typeof Symbol&&"symbol"===s(Symbol.iterator)?function(t){return s(t)}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":s(t)},n(t)}c.d(e,"a",function(){return n})},4964:function(t,e,c){"use strict";function s(t){if(Array.isArray(t)){for(var e=0,c=new Array(t.length);e<t.length;e++)c[e]=t[e];return c}}function n(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function o(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function i(t){return s(t)||n(t)||o()}c.d(e,"a",function(){return i})},b1d6:function(t,e,c){},b745:function(t,e,c){"use strict";var s=c("b2f5"),n=c("648a"),o=c("db4b"),i=c("b6f1"),r=[].sort,a=[1,2,3];s(s.P+s.F*(i(function(){a.sort(void 0)})||!i(function(){a.sort(null)})||!c("119c")(r)),"Array",{sort:function(t){return void 0===t?r.call(o(this)):r.call(o(this),n(t))}})}}]);
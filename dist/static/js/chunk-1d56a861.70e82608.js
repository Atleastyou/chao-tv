(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1d56a861"],{"0c95":function(t,e,i){},"119c":function(t,e,i){"use strict";var s=i("b6f1");t.exports=function(t,e){return!!t&&s(function(){e?t.call(null,function(){},1):t.call(null)})}},"1ce9":function(t,e,i){"use strict";var s=i("3754"),a=i("b2f5"),n=i("e5ef"),r=i("f216"),o=i("3cc6"),c=i("00d5"),u=i("d74e"),l=i("88dd"),h=i("b6f1"),d=i("5b55"),p=i("6594"),f=i("44de");t.exports=function(t,e,i,v,m,g){var b=s[t],_=b,k=m?"set":"add",y=_&&_.prototype,w={},x=function(t){var e=y[t];n(y,t,"delete"==t?function(t){return!(g&&!l(t))&&e.call(this,0===t?0:t)}:"has"==t?function(t){return!(g&&!l(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return g&&!l(t)?void 0:e.call(this,0===t?0:t)}:"add"==t?function(t){return e.call(this,0===t?0:t),this}:function(t,i){return e.call(this,0===t?0:t,i),this})};if("function"==typeof _&&(g||y.forEach&&!h(function(){(new _).entries().next()}))){var C=new _,S=C[k](g?{}:-0,1)!=C,$=h(function(){C.has(1)}),O=d(function(t){new _(t)}),R=!g&&h(function(){var t=new _,e=5;while(e--)t[k](e,e);return!t.has(-0)});O||(_=e(function(e,i){u(e,_,t);var s=f(new b,e,_);return void 0!=i&&c(i,m,s[k],s),s}),_.prototype=y,y.constructor=_),($||R)&&(x("delete"),x("has"),m&&x("get")),(R||S)&&x(k),g&&y.clear&&delete y.clear}else _=v.getConstructor(e,t,m,k),r(_.prototype,i),o.NEED=!0;return p(_,t),w[t]=_,a(a.G+a.W+a.F*(_!=b),w),g||v.setStrong(_,t,m),_}},"1f2a":function(t,e,i){"use strict";var s=i("0c95"),a=i.n(s);a.a},"3b54":function(t,e,i){"use strict";var s=i("2f03")(!0);i("7656")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=s(e,i),this._i+=t.length,{value:t,done:!1})})},"3cb6":function(t,e,i){"use strict";var s=i("e6ef"),a=i("4678"),n="Set";t.exports=i("1ce9")(n,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return s.def(a(this,n),t=0===t?0:t,t)}},s)},"3cc6":function(t,e,i){var s=i("9d01")("meta"),a=i("88dd"),n=i("03b3"),r=i("ddf7").f,o=0,c=Object.isExtensible||function(){return!0},u=!i("b6f1")(function(){return c(Object.preventExtensions({}))}),l=function(t){r(t,s,{value:{i:"O"+ ++o,w:{}}})},h=function(t,e){if(!a(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!n(t,s)){if(!c(t))return"F";if(!e)return"E";l(t)}return t[s].i},d=function(t,e){if(!n(t,s)){if(!c(t))return!0;if(!e)return!1;l(t)}return t[s].w},p=function(t){return u&&f.NEED&&c(t)&&!n(t,s)&&l(t),t},f=t.exports={KEY:s,NEED:!1,fastKey:h,getWeak:d,onFreeze:p}},"425e":function(t,e,i){"use strict";var s=i("be30"),a=i.n(s);a.a},4262:function(t,e,i){},4678:function(t,e,i){var s=i("88dd");t.exports=function(t,e){if(!s(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},"4d24":function(t,e,i){},"561f":function(t,e,i){},"6e08":function(t,e,i){"use strict";var s=i("4d24"),a=i.n(s);a.a},8674:function(t,e,i){"use strict";var s=i("4262"),a=i.n(s);a.a},"9fa4":function(t,e,i){"use strict";var s=i("01f5"),a=i("b2f5"),n=i("db4b"),r=i("8bbc"),o=i("c847"),c=i("b146"),u=i("f59b"),l=i("1a9b");a(a.S+a.F*!i("5b55")(function(t){Array.from(t)}),"Array",{from:function(t){var e,i,a,h,d=n(t),p="function"==typeof this?this:Array,f=arguments.length,v=f>1?arguments[1]:void 0,m=void 0!==v,g=0,b=l(d);if(m&&(v=s(v,f>2?arguments[2]:void 0,2)),void 0==b||p==Array&&o(b))for(e=c(d.length),i=new p(e);e>g;g++)u(i,g,m?v(d[g],g):d[g]);else for(h=b.call(d),i=new p;!(a=h.next()).done;g++)u(i,g,m?r(h,v,[a.value,g],!0):a.value);return i.length=g,i}})},b745:function(t,e,i){"use strict";var s=i("b2f5"),a=i("648a"),n=i("db4b"),r=i("b6f1"),o=[].sort,c=[1,2,3];s(s.P+s.F*(r(function(){c.sort(void 0)})||!r(function(){c.sort(null)})||!i("119c")(o)),"Array",{sort:function(t){return void 0===t?o.call(n(this)):o.call(n(this),a(t))}})},be30:function(t,e,i){},dd7b:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("header",{staticClass:"sketch-header"},[i("sketch-list",{ref:"sketchList",attrs:{exit:t.exit}}),i("div",{staticClass:"sketch-exit",on:{click:t.exit}},[i("i",{staticClass:"icon-exit"})]),i("div",{staticClass:"sketch-name"},[i("p",{on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.toggleNamePopover(e)}}},[i("span",[t._v(t._s(t.form.title))]),i("i",{staticClass:"icon-bottom"})]),i("transition",{attrs:{name:"popover"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.namePopoverShow,expression:"namePopoverShow"}],staticClass:"sketch-name-popover",on:{click:function(t){t.stopPropagation(),t.preventDefault()}}},[i("div",{staticClass:"sketch-name-input"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.form.title,expression:"form.title"}],attrs:{placeholder:"未命名"},domProps:{value:t.form.title},on:{input:function(e){e.target.composing||t.$set(t.form,"title",e.target.value)}}})]),i("div",{staticClass:"sketch-name-select"},[i("select",{directives:[{name:"model",rawName:"v-model",value:t.form.style,expression:"form.style"}],staticClass:"sketch-name-select_first",on:{change:function(e){var i=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.$set(t.form,"style",e.target.multiple?i:i[0])}}},[i("option",{attrs:{value:"",disabled:""}},[t._v("#风格")]),t._l(t.styleList,function(e){return i("option",{domProps:{value:e.name}},[t._v(t._s(e.name))])})],2),i("select",{directives:[{name:"model",rawName:"v-model",value:t.form.space,expression:"form.space"}],on:{change:function(e){var i=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.$set(t.form,"space",e.target.multiple?i:i[0])}}},[i("option",{attrs:{value:"",disabled:""}},[t._v("#场景")]),t._l(t.spaceList,function(e){return i("option",{domProps:{value:e.name}},[t._v(t._s(e.name))])})],2)]),i("div",{staticClass:"sketch-name-textarea"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.form.note,expression:"form.note"}],attrs:{placeholder:"更多描述…"},domProps:{value:t.form.note},on:{input:function(e){e.target.composing||t.$set(t.form,"note",e.target.value)}}})])])])],1),i("div",{staticClass:"sketch-header-handles"},[i("div",{staticClass:"sketch-header-handle",class:{disabled:!t._history.undo.length},on:{click:t.undoFun}},[i("i",{staticClass:"icon-revoke"}),i("span",[t._v("撤销")])]),i("div",{staticClass:"sketch-header-handle",class:{disabled:!t._history.redo.length},on:{click:t.redoFun}},[i("i",{staticClass:"icon-reset"}),i("span",[t._v("恢复")])]),i("div",{staticClass:"sketch-header-handle"},[i("div",{on:{click:function(e){return e.stopPropagation(),t.showDropdown(e)}}},[i("i",{staticClass:"icon-edit-1"}),i("span",[t._v("画布")])]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.dropdownShow,expression:"dropdownShow"}],staticClass:"dropdown",on:{click:function(t){t.stopPropagation()}}},[i("p",{on:{click:t.resetSketch}},[t._v("重置画布")]),i("p",{on:{click:t.clearSketch}},[t._v("清空画布")])])]),i("div",{staticClass:"sketch-header-handle",on:{click:t.temporarySave}},[t.saveing?i("i",{staticClass:"icon-loading"}):i("i",{staticClass:"icon-add-1"}),i("span",[t._v("保存")])])]),i("div",{staticClass:"sketch-header-box"},[i("div",{staticClass:"sketch-export-phone",on:{click:t.showExportQrcode}},[t._v("导出到手机")]),i("div",{staticClass:"sketch-price",on:{click:t.showSketchList}},[i("span",[t._v("清单")]),i("em",[t._v("¥"+t._s(parseFloat(t.totalPrice).toFixed(2)))])])]),i("div",{ref:"upload",staticClass:"upload"})],1)},a=[],n=(i("7364"),i("34a3"),i("e680"),i("3c6b"),i("7bc1"),i("4453"),i("089b")),r=i("e20c"),o=i("591a"),c=i("1638"),u=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("modal",{attrs:{name:"sketchList",width:"100%",height:"100%"},on:{"before-open":t.beforeOpen}},[i("div",{staticClass:"sketch-list"},[i("div",{staticClass:"sketch-list-header"},[i("div",{staticClass:"table-header-item"},[i("div",{staticClass:"icon-close",on:{click:t.close}})]),i("div",{staticClass:"table-header-item table-header-item_goods"},[t._v("商品名称")]),i("div",{staticClass:"table-header-item table-header-item_detail"},[t._v("详情描述")]),i("div",{staticClass:"table-header-item table-header-item_num"},[t._v("数量")]),i("div",{staticClass:"table-header-item table-header-item_stock"},[t._v("库存")]),i("div",{staticClass:"table-header-item table-header-item_price"},[t._v("价格")])]),i("div",{staticClass:"sketch-list-content"},[i("div",{staticClass:"sketch-content-header"},[t._v("方案名称："+t._s(t.detail.title))]),t.tableData.length?i("div",{staticClass:"sketch-content-table"},t._l(t.tableData,function(e){return i("div",{staticClass:"table-item",class:{"table-item--disable":0==e.is_buy}},[i("c-radio",{attrs:{disabled:0===e.is_buy,size:"mini"},model:{value:e.isRadio,callback:function(i){t.$set(e,"isRadio",i)},expression:"item.isRadio"}}),i("div",{staticClass:"table-item-img",style:{"background-image":"url("+e.original_img+")"}}),i("div",{staticClass:"table-item-name"},[t._v(t._s(e.goods_name))]),i("div",{staticClass:"table-item-spec"},[t._v(t._s(e.key_name))]),i("mu-menu",{attrs:{"popover-class":"sketch-list-popover",placement:"bottom-end",open:e.openPop},on:{open:function(i){return t.popOpen(e)},"update:open":function(i){return t.$set(e,"openPop",i)}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.key_name,expression:"item.key_name"}],staticClass:"table-item-change"},[t._v(t._s(0==e.is_buy?"":"修改"))]),i("div",{staticClass:"mu-menu-content",attrs:{slot:"content"},slot:"content"},[i("popover-content",{on:{closePop:t.closePop,confirmPop:t.confirmPop}})],1)]),i("div",{staticClass:"table-item-num"},[i("c-number",{attrs:{disabled:0===e.is_buy,min:1,max:e.store_count},model:{value:e.goods_num,callback:function(i){t.$set(e,"goods_num",i)},expression:"item.goods_num"}})],1),i("div",{staticClass:"table-item-stock"},[t._v(t._s(e.store_count))]),0!=e.is_buy?i("div",{staticClass:"table-item-price"},[t._v("¥"+t._s(e.shop_price))]):t._e()],1)}),0):i("div",{staticClass:"sketch-content-info"},[t._v("该方案暂无商品清单")])]),i("div",{staticClass:"sketch-list-footer"},[i("div",{staticClass:"sketch-footer-radio"},[i("c-radio",{attrs:{size:"mini"},model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}}),i("div",{staticClass:"radio-text"},[t._v("全选")])],1),i("div",{staticClass:"sketch-footer-btn"},[i("div",{staticClass:"total-money"},[i("div",{staticClass:"total-money-text"},[t._v("合计：")]),i("div",{staticClass:"total-money-num"},[t._v("¥"+t._s(t.price))])]),i("div",{staticClass:"sketch-add-shopping",on:{click:t.addShoppCart}},[t._v("加入购物车")]),i("div",{staticClass:"sketch-shopping",on:{click:t.buy}},[t._v("立即购买")])])])])])},l=[],h=(i("cde0"),i("f763"),i("e0a6")),d=i("880a"),p={name:"sketchList",props:{exit:{type:Function,required:!0}},components:{popoverContent:h["a"]},data:function(){return{popGoods:{},num:1,goodsId:null,detail:{},checkList:[],tableData:[]}},computed:Object(r["a"])({},Object(o["c"])({sketchGoods:function(t){return t.sketch.sketchGoods}}),{radio:{get:function(){var t=0,e=0;return!!this.tableData.length&&(this.tableData.forEach(function(i){i.is_buy&&e++,i.isRadio&&i.is_buy&&t++}),e===t)},set:function(t){this.tableData.forEach(function(e){t&&e.is_buy?e.isRadio=!0:e.isRadio=!1})}},price:function(){var t=0;return this.tableData.forEach(function(e){e.isRadio&&e.is_buy&&(t+=parseFloat(e.shop_price)*e.goods_num)}),t.toFixed(2)}}),methods:Object(r["a"])({},Object(o["b"])(["showConfirmModal","changeModifyPop"]),{close:function(){this.$modal.hide("sketchList")},closePop:function(){var t=this;this.tableData.forEach(function(e){e.goods_id===t.popGoods.goods_id&&(e.openPop=!1)})},confirmPop:function(t){var e=this;this.popGoods=Object(r["a"])({},this.popGoods,t);var i=this.tableData.findIndex(function(t){return t.uid===e.popGoods.uid});this.tableData.splice(i,1,this.popGoods),this.tableData[i].openPop=!1},beforeOpen:function(t){var e=t.params;this.goodsId=e.id,this.setSketchGoods()},popOpen:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(e){var i,s,a,n,r,o,c;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,this.popGoods=e,i=e.key.split("_"),s=[],this.goodsDetail=e,t.next=7,this.$axios.get(d["getGoodSpec"],{params:{goods_id:e.goods_id}});case 7:a=t.sent,n=a.data,n.spec.map(function(t,e){return t.spec_item.map(function(a){i.map(function(i){parseInt(i)===a.id&&(t.activeId=a.id,s.splice(e,1,a.id))})})}),r=n.spec_value[e.key].spec_img,o=n.spec_value[e.key].shop_price,this.changeModifyPop({detail:n,specKeys:s,viewImg:r,orderId:e.id,price:o}),t.next=19;break;case 15:t.prev=15,t.t0=t["catch"](0),c=t.t0.msg,this.$toast.error(c);case 19:case"end":return t.stop()}},t,this,[[0,15]])}));function e(e){return t.apply(this,arguments)}return e}(),addShoppCart:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e=[],this.tableData.forEach(function(t){if(t.isRadio){var i={goods_id:t.goods_id,key:t.key?t.key:"",goods_num:t.goods_num};e.push(i)}}),t.next=5,this.$axios.post(d["sketchAdd"],{goods:e});case 5:this.$toast.success("已加入购物车"),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),i=t.t0.msg,this.$toast.error(i);case 12:case"end":return t.stop()}},t,this,[[0,8]])}));function e(){return t.apply(this,arguments)}return e}(),buy:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.checkList=[],this.tableData.forEach(function(t){if(t.isRadio){var i={goods_id:t.goods_id,key:t.key?t.key:"",goods_num:t.goods_num};e.checkList.push(i)}}),this.checkList.length){t.next=5;break}return this.$toast.error("请至少先选择一个商品"),t.abrupt("return");case 5:this.exit("sketchList");case 6:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),routerPush:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.$axios.post(d["sketchBuy"],{goods:this.checkList});case 3:return e=t.sent,i=e.data,this.close(),t.next=8,this.$router.push({name:"confirmOrder",query:{from:"sketch",token:i.token,goods_id:this.$route.params.id}});case 8:t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](0),s=t.t0.msg,this.$toast.error(s);case 14:case"end":return t.stop()}},t,this,[[0,10]])}));function e(){return t.apply(this,arguments)}return e}(),getSceneCaseDetail:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s,a=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.$axios.get(d["getSceneCaseDetail"],{params:{id:this.goodsId}});case 3:e=t.sent,i=e.data,i.goods&&(this.detail=i,i.goods.forEach(function(t){t.is_buy?a.$set(t,"isRadio",!0):a.$set(t,"isRadio",!1)}),this.tableData=i.goods),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),s=t.t0.msg,this.$toast.error(s);case 12:case"end":return t.stop()}},t,this,[[0,8]])}));function e(){return t.apply(this,arguments)}return e}(),setSketchGoods:function(){var t=this,e=JSON.parse(JSON.stringify(this.sketchGoods));e.forEach(function(e){e.is_buy||0===e.is_buy||(e.is_buy=1),e.is_buy?t.$set(e,"isRadio",!0):t.$set(e,"isRadio",!1),t.$set(e,"openPop",!1),e.goods_num||(e.goods_num=1)}),this.tableData=e}})},f=p,v=(i("8674"),i("6e08"),i("17cc")),m=Object(v["a"])(f,u,l,!1,null,"3ecba0e6",null),g=m.exports,b=null,_={name:"sketchHeader",props:{initData:Object},data:function(){return{uploadTimeout:12e4,form:{title:"未命名",style:"",space:"",note:"",is_public:"",cont:null,preview:""},saveing:!1,reseting:!1,loading:null,caseId:"",from:"",styleList:[],spaceList:[],namePopoverShow:!1,saveType:"",exportShowGood:0,dropdownShow:!1}},components:{sketchList:g},watch:{initData:function(t){this.form={title:this.initData.title,style:this.initData.style,space:this.initData.space,note:this.initData.note,is_public:this.initData.is_public,preview:this.initData.preview}},requestStatus:function(t){t||(this.$toast.error("网络异常，请检查您的网络状态！"),this.loading&&this.loading.close())}},methods:Object(r["a"])({},Object(o["b"])(["changeCaseDetail","changeSkuDetail","changeMatrix","clearHistory","rePlayHistory","showConfirmModal","changeStyleList","changeSpaceList","changeExportQrcode","changeRandomCate","updateHistory","showExportConfirmModal","changeSketchGoods"]),{resetSketch:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s,a,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.showConfirmModal({title:"重置画布",paragraph:"确定要重置该画布吗？",confirmButtonText:"确定",cancelButtonText:"取消"});case 3:if(e=t.sent,1===e){t.next=6;break}return t.abrupt("return");case 6:if(!this.$route.params.id){t.next=18;break}if(!this.reseting){t.next=9;break}return t.abrupt("return");case 9:return this.reseting=!0,t.next=12,this.$axios.get(d["getSceneCaseDetail"],{params:{id:this.$route.params.id}});case 12:i=t.sent,s=i.data,window.canvas.loadFromJSON(JSON.parse(s.cont),this.updateHistory),this.changeSketchGoods({type:"reload",list:s.goods}),t.next=20;break;case 18:window.canvas.clear(),this.changeSketchGoods({type:"clear"});case 20:t.next=26;break;case 22:t.prev=22,t.t0=t["catch"](0),a=t.t0.msg,this.$toast.error(a);case 26:return t.prev=26,setTimeout(function(){n.reseting=!1},2e3),t.finish(26);case 29:case"end":return t.stop()}},t,this,[[0,22,26,29]])}));function e(){return t.apply(this,arguments)}return e}(),clearSketch:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.showConfirmModal({title:"清空画布",paragraph:"确定要清空该画布吗？",confirmButtonText:"确定",cancelButtonText:"取消"});case 2:if(e=t.sent,1===e){t.next=5;break}return t.abrupt("return");case 5:window.canvas.clear(),this.updateHistory(),this.changeSketchGoods({type:"clear"});case 8:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),showDropdown:function(){this.dropdownShow=!this.dropdownShow},temporarySave:function(){if(!this.saveing&&canvas._objects.length){this.saveing=!0;var t=this.dataURLtoBlob(canvas.toDataURL({format:"jpg",width:1440,height:800}));this.up.addFile(t),this.up.start(),this.saveType="temporarySave"}},showExportQrcode:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s,a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.showExportConfirmModal();case 2:if(e=t.sent,i=e.confirmed,s=e.value,i){t.next=7;break}return t.abrupt("return");case 7:if(!this.matrix.show){t.next=10;break}return this.$toast.message("请先取消变形"),t.abrupt("return");case 10:if(this.requestStatus){t.next=13;break}return this.$toast.error("网络异常，请检查您的网络状态！"),t.abrupt("return");case 13:if(canvas._objects.length){t.next=16;break}return this.$toast.error("没有可以导出的内容"),t.abrupt("return");case 16:this.loading=this.$loading({}),a=this.dataURLtoBlob(canvas.toDataURL({format:"jpg",width:1440,height:800})),this.up.addFile(a),this.up.start(),this.saveType="export_phone",this.exportShowGood=s;case 22:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),showSketchList:function(){this.matrix.show?this.$toast.message("请先取消变形"):(this.changeMatrix({points:{},img:"",show:!1}),this.$modal.show("sketchList",{id:this.$route.params.id?this.$route.params.id:"-1"}))},save:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,this.$route.params.id&&"edit"===this.$route.query.type&&(this.form.id=this.$route.params.id),this.form.cont=JSON.stringify(canvas.toJSON(["goods_id","uid","goods_key"])),t.next=5,this.$axios.post(d["updateCase"],Object(r["a"])({},this.form,{goods:this.sketchGoods}));case 5:e=t.sent,i=e.data,this.caseId=i.id,"sketchList"===this.from&&this.$refs.sketchList.routerPush(),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](0),s=t.t0.msg,this.$toast.error(s);case 15:return t.prev=15,this.saveing=!1,this.loading&&this.loading.close(),t.finish(15);case 19:case"end":return t.stop()}},t,this,[[0,11,15,19]])}));function e(){return t.apply(this,arguments)}return e}(),exit:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(e){var i,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.requestStatus){t.next=3;break}return this.$toast.error("网络异常，请检查您的网络状态！"),t.abrupt("return");case 3:if(!this.matrix.show){t.next=6;break}return this.$toast.error("操作失败，正在执行变形操作"),t.abrupt("return");case 6:if(this.from=e,!canvas._objects.length){t.next=18;break}return t.next=10,this.showConfirmModal({title:"退出确认",paragraph:"要在退出之前存储对搭配方案“".concat(this.form.title,"”的更改吗？"),confirmButtonText:"存储并退出",isSaveBtn:!0});case 10:i=t.sent,this.loading=this.$loading({text:""}),this.changeCaseDetail({show:!1,id:""}),this.changeSkuDetail({show:!1,id:null}),this.changeRandomCate(),1===i?(s=this.dataURLtoBlob(canvas.toDataURL({format:"jpg",width:1440,height:800})),this.up.addFile(s),this.up.start(),this.saveType="exit",this.$emit("changeStorage",!0)):0===i?(canvas.clear().renderAll(),"sketchList"===e?this.$refs.sketchList.routerPush():(this.$router.back(),this.loading&&this.loading.close())):this.loading&&this.loading.close(),t.next=22;break;case 18:this.changeCaseDetail({show:!1,id:""}),this.changeSkuDetail({show:!1,id:null}),canvas.clear().renderAll(),"sketchList"===e?this.$refs.sketchList.routerPush():this.$router.back();case 22:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),dataURLtoBlob:function(t){var e=t.split(","),i=e[0].match(/:(.*?);/)[1],s=atob(e[1]),a=s.length,n=new Uint8Array(a);while(a--)n[a]=s.charCodeAt(a);return new Blob([n],{type:i})},getStyleList:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.$axios.get(d["getStyleList"]);case 3:e=t.sent,i=e.data,this.styleList=i.ls,this.changeStyleList(i.ls),t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](0),this.$toast.error(t.t0.msg);case 12:case"end":return t.stop()}},t,this,[[0,9]])}));function e(){return t.apply(this,arguments)}return e}(),getSpaceList:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.$axios.get(d["getSpaceList"]);case 3:e=t.sent,i=e.data,this.spaceList=i.ls,this.changeSpaceList(i.ls),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),s=t.t0.msg,this.$toast.error(s);case 13:case"end":return t.stop()}},t,this,[[0,9]])}));function e(){return t.apply(this,arguments)}return e}(),upload:function(){var t=this;try{if(this.up)return!1;var e={browse_button:this.$refs.upload,multi_selection:!1,max_file_size:"20mb"};this.up=new c["a"](e),this.up.bind("FileUploaded",function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(i,s,a){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if("exit"!==t.saveType){e.next=8;break}return t.form.preview="".concat(i.domain).concat(JSON.parse(a.response||a).key),e.next=4,t.save();case 4:t.$router.back(),t.clearHistory(),e.next=21;break;case 8:if("export_phone"!==t.saveType){e.next=16;break}return t.form.preview="".concat(i.domain).concat(JSON.parse(a.response||a).key),e.next=12,t.save();case 12:t.$router.replace({name:t.$route.name,params:{id:t.caseId},query:Object(r["a"])({type:"edit"},t.$route.query)}),t.changeExportQrcode({show:!0,img:"".concat(i.domain).concat(JSON.parse(a.response||a).key),id:t.caseId,show_good:t.exportShowGood}),e.next=21;break;case 16:if("temporarySave"!==t.saveType){e.next=21;break}return t.form.preview="".concat(i.domain).concat(JSON.parse(a.response||a).key),e.next=20,t.save();case 20:t.$router.replace({name:t.$route.name,params:{id:t.caseId},query:Object(r["a"])({type:"edit"},t.$route.query,{temporarySave:(new Date).getTime()})});case 21:case"end":return e.stop()}},e)}));return function(t,i,s){return e.apply(this,arguments)}}()),this.up.bind("BeforeUpload",function(){b=setTimeout(function(){t.$toast.error("上传超时，请检查网络后重试"),t.up.stop(),t.up.clearFiles(),t.loading&&t.loading.close(),t.saveing=!1},t.uploadTimeout)}),this.up.bind("UploadComplete",function(){clearInterval(b),t.saveType="",t.up.clearFiles()}),this.up.bind("Error",function(e,i,s){t.loading&&t.loading.close()}),this.up.init()}catch(i){this.loading&&this.loading.close()}},undoFun:function(){this.matrix.show||this._history.undo.length&&this.rePlayHistory({playStack:"undo",saveStack:"redo"})},redoFun:function(){this.matrix.show||this._history.redo.length&&this.rePlayHistory({playStack:"redo",saveStack:"undo"})},toggleNamePopover:function(){this.namePopoverShow=!this.namePopoverShow}}),computed:Object(r["a"])({},Object(o["c"])({matrix:function(t){return t.sketch.matrix},sketchGoods:function(t){return t.sketch.sketchGoods},_history:function(t){return t.sketch.history},requestStatus:function(t){return t.modal.requestStatus.status}}),{totalPrice:function(){var t=this.sketchGoods.reduce(function(t,e){return t+parseFloat(e.shop_price)},0);return parseFloat(t).toFixed(2)}}),created:function(){this.getStyleList(),this.getSpaceList()},mounted:function(){var t=this;this.upload(),window.onbeforeunload=function(t){if(canvas._objects.length)return""},document.addEventListener("click",function(){t.namePopoverShow=!1,t.dropdownShow=!1})}},k=_,y=(i("1f2a"),i("ed7c"),Object(v["a"])(k,s,a,!1,null,"76035b2a",null));e["default"]=y.exports},e0a6:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"modify-pop-body"},[i("div",{staticClass:"goods-detail-img"},[i("div",{staticClass:"goods-photo"},[i("img",{attrs:{src:t.viewImg}})])]),i("div",{staticClass:"goods-detail-body"},[i("div",{staticClass:"icon-close",on:{click:t.close}}),i("div",{staticClass:"goods-price"},[t._v("¥"+t._s(t.price))]),i("div",{staticClass:"goods-spec-items"},t._l(t.detail.spec,function(e,s){return i("div",{staticClass:"spec-item"},[i("div",{staticClass:"spec-item-label"},[t._v(t._s(e.name)+"：")]),i("div",{staticClass:"spec-item-content"},t._l(e.spec_item,function(a){return i("div",{staticClass:"spec-item-value",class:{active:e.activeId===a.id},on:{click:function(e){return t.selectSpec(a,s)}}},[a.src?i("img",{attrs:{src:a.src}}):t._e(),i("span",[t._v(t._s(a.item))])])}),0)])}),0),i("div",{staticClass:"goods-detail-handle",on:{click:t.confirm}},[t._v("确认修改")])])])},a=[],n=(i("4453"),i("089b")),r=(i("f763"),i("3cb6"),i("3b54"),i("9fa4"),i("b745"),i("e20c")),o=i("591a"),c={name:"popoverContent",data:function(){return{}},computed:Object(r["a"])({},Object(o["c"])({detail:function(t){return t.ui.modifyPop.detail},viewImg:function(t){return t.ui.modifyPop.viewImg},specKeys:function(t){return t.ui.modifyPop.specKeys},orderId:function(t){return t.ui.modifyPop.orderId},price:function(t){return t.ui.modifyPop.price}})),methods:Object(r["a"])({},Object(o["b"])(["changeModifyPop"]),{close:function(){this.$emit("closePop")},selectSpec:function(t,e){var i=JSON.parse(JSON.stringify(this.detail)),s=JSON.parse(JSON.stringify(this.specKeys)),a="",n="";if(i.spec.map(function(e){return e.spec_item.map(function(i){t.id===i.id&&(e.activeId=t.id)})}),s.splice(e,1,t.id),s.length===i.spec.length){this.key=Array.from(new Set(s)).sort(function(t,e){return t-e}).join("_");var r=i.spec_value[this.key];a=r.spec_img?r.spec_img:this.viewImg,n=r.shop_price?r.shop_price:this.price}this.changeModifyPop({detail:i,specKeys:s,viewImg:a,price:n})},confirm:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,i,s,a=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,e={},e.key=Array.from(new Set(this.specKeys)).sort(function(t,e){return t-e}).join("_"),i=["key_name","market_price","original_img","selling_price","shop_price","store_count"],i.forEach(function(t){e[t]=a.detail.spec_value[e.key][t],"original_img"===t&&(e[t]=a.detail.spec_value[e.key].spec_img)}),e.store_count){t.next=8;break}return this.$toast.error("该规格商品库存为0"),t.abrupt("return");case 8:this.$emit("confirmPop",e),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](0),s=t.t0.msg,this.$toast.error(s);case 15:case"end":return t.stop()}},t,this,[[0,11]])}));function e(){return t.apply(this,arguments)}return e}()})},u=c,l=(i("425e"),i("17cc")),h=Object(l["a"])(u,s,a,!1,null,"16c05cf6",null);e["a"]=h.exports},e6ef:function(t,e,i){"use strict";var s=i("ddf7").f,a=i("a7b8"),n=i("f216"),r=i("01f5"),o=i("d74e"),c=i("00d5"),u=i("7656"),l=i("e650"),h=i("c650"),d=i("dad2"),p=i("3cc6").fastKey,f=i("4678"),v=d?"_s":"size",m=function(t,e){var i,s=p(e);if("F"!==s)return t._i[s];for(i=t._f;i;i=i.n)if(i.k==e)return i};t.exports={getConstructor:function(t,e,i,u){var l=t(function(t,s){o(t,l,e,"_i"),t._t=e,t._i=a(null),t._f=void 0,t._l=void 0,t[v]=0,void 0!=s&&c(s,i,t[u],t)});return n(l.prototype,{clear:function(){for(var t=f(this,e),i=t._i,s=t._f;s;s=s.n)s.r=!0,s.p&&(s.p=s.p.n=void 0),delete i[s.i];t._f=t._l=void 0,t[v]=0},delete:function(t){var i=f(this,e),s=m(i,t);if(s){var a=s.n,n=s.p;delete i._i[s.i],s.r=!0,n&&(n.n=a),a&&(a.p=n),i._f==s&&(i._f=a),i._l==s&&(i._l=n),i[v]--}return!!s},forEach:function(t){f(this,e);var i,s=r(t,arguments.length>1?arguments[1]:void 0,3);while(i=i?i.n:this._f){s(i.v,i.k,this);while(i&&i.r)i=i.p}},has:function(t){return!!m(f(this,e),t)}}),d&&s(l.prototype,"size",{get:function(){return f(this,e)[v]}}),l},def:function(t,e,i){var s,a,n=m(t,e);return n?n.v=i:(t._l=n={i:a=p(e,!0),k:e,v:i,p:s=t._l,n:void 0,r:!1},t._f||(t._f=n),s&&(s.n=n),t[v]++,"F"!==a&&(t._i[a]=n)),t},getEntry:m,setStrong:function(t,e,i){u(t,e,function(t,i){this._t=f(t,e),this._k=i,this._l=void 0},function(){var t=this,e=t._k,i=t._l;while(i&&i.r)i=i.p;return t._t&&(t._l=i=i?i.n:t._t._f)?l(0,"keys"==e?i.k:"values"==e?i.v:[i.k,i.v]):(t._t=void 0,l(1))},i?"entries":"values",!i,!0),h(e)}}},ed7c:function(t,e,i){"use strict";var s=i("561f"),a=i.n(s);a.a},f59b:function(t,e,i){"use strict";var s=i("ddf7"),a=i("7dea");t.exports=function(t,e,i){e in t?s.f(t,e,a(0,i)):t[e]=i}}}]);
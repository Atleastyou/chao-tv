(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-09393360"],{"05ba":function(e,t){var a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(a){var i=new Uint8Array(16);e.exports=function(){return a(i),i}}else{var s=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0===(3&t)&&(e=4294967296*Math.random()),s[t]=e>>>((3&t)<<3)&255;return s}}},"0d2c":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:"scale"}},[e.show?a("div",{staticClass:"case-detail"},[a("div",{staticClass:"case-detail-close"},[a("i",{staticClass:"icon-close",on:{click:e.closeCaseDetail}})]),a("div",{staticClass:"case-detail-box"},[a("div",{staticClass:"case-detail-priview",style:{"background-image":"url("+e.caseDetail.preview+")"}}),a("p",{staticClass:"case-detail-name"},[e._v(e._s(e.caseDetail.title))]),a("div",{staticClass:"case-detail-cell"},[a("p",{staticClass:"case-detail-tags"},[e.caseDetail.tags?a("span",[e._v(e._s(e.caseDetail.tags.split(" ").join("/")))]):e._e()]),a("div",{staticClass:"case-detail-handles"},[e.caseDetail.is_self?a("i",{staticClass:"icon-edit",on:{click:function(t){return e.editCase(e.caseDetail.id)}}}):e._e(),e.caseDetail.is_self?a("i",{staticClass:"icon-delete",on:{click:function(t){return e.deleteCase(e.caseDetail.id)}}}):e._e(),a("div",{staticClass:"case-detail-collection",on:{click:e.collectionCase}},[e.caseDetail.is_collection?a("i",{staticClass:"icon-collection_active"}):a("i",{staticClass:"icon-collection"})])])]),a("div",{staticClass:"case-detail-btn",on:{click:function(t){return e.againCreation(e.caseDetail.cont,e.caseDetail.id)}}},[a("touch-ripple",{attrs:{speed:2,opacity:.5}},[e._v("再创作")])],1)]),a("div",{staticClass:"goods-recommend"},[a("p",{staticClass:"goods-title"},[e._v("使用到的单品")]),e._l(e.caseDetail.goods,function(t){return a("div",{staticClass:"goods-body"},[a("div",{staticClass:"good-item",class:{"good-item--disabled":!t.is_buy},on:{click:function(a){return e.openGoodDetail(t)}}},[a("div",{staticClass:"good-img",style:{"background-image":"url("+t.original_img+"?imageslim&imageView2/0/w/560)"},attrs:{id:t.goods_id,source:"brandGoods",type:"good"}},[t.is_buy?e._e():a("div",{staticClass:"good-img--disabled"},[a("span",[e._v("失效")])]),a("div",{staticClass:"good-btns"},[a("div",{staticClass:"good-btn",on:{click:function(a){return a.stopPropagation(),e.replaceImage(t.original_img,t)}}},[e._v("替换")]),a("div",{staticClass:"good-btn",on:{click:function(a){return a.stopPropagation(),e.addImage(t.original_img,t)}}},[e._v("添加")])])]),a("div",{staticClass:"good-cell"},[a("div",{staticClass:"good-money-vip"},[a("em",[e._v("¥"+e._s(t.shop_price))]),a("span",[e._v("会员")])]),t.is_collection?a("i",{staticClass:"icon-collection_active",on:{click:function(a){return a.stopPropagation(),e.collectionGood(t)}}}):a("i",{staticClass:"icon-collection",on:{click:function(a){return a.stopPropagation(),e.collectionGood(t)}}})]),a("div",{staticClass:"good-money"},[a("span",[e._v("零售价")]),a("em",[e._v("¥"+e._s(t.market_price))])]),a("p",{staticClass:"good-name"},[e._v(e._s(t.goods_name))])])])})],2)]):e._e()])},s=[],n=(a("f763"),a("7364"),a("34a3"),a("d4d5"),a("4453"),a("089b")),r=a("e20c"),o=a("591a"),c=a("880a"),l=a("5428"),u=a.n(l),d={name:"caseDetail",data:function(){return{caseDetail:{goods:[]}}},watch:{id:function(e){e?this.getCaseDetail():this.caseDetail={goods:[]}}},methods:Object(r["a"])({},Object(o["b"])(["changeSkuDetail","changeCaseDetail","changeSketchGoods","showReplaceModal","showConfirmModal","updateHistory"]),{collectionGood:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var a,i,s,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(e.prev=0,a=t.is_collection,i=t.goods_id,s=t.is_buy,s){e.next=4;break}return e.abrupt("return");case 4:if(!a){e.next=9;break}return e.next=7,this.$axios.get(c["unCollection"],{params:{goods_id:i}});case 7:e.next=11;break;case 9:return e.next=11,this.$axios.get(c["setCollection"],{params:{goods_id:i}});case 11:this.$set(t,"is_collection",!a),e.next=18;break;case 14:e.prev=14,e.t0=e["catch"](0),n=e.t0.msg,this.$toast.error(n);case 18:case"end":return e.stop()}},e,this,[[0,14]])}));function t(t){return e.apply(this,arguments)}return t}(),deleteCase:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var a,i,s;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(e.prev=0,Number(this.$route.params.id)!==t||"edit"!==this.$route.query.type){e.next=4;break}return this.$toast.error("操作无法完成，当前方案在编辑中"),e.abrupt("return");case 4:return console.log(Number(this.$route.params.id)===t),e.next=7,this.showConfirmModal({title:"删除确认",paragraph:Number(this.$route.params.id)===t?"您确定要删除案例吗？删除后画板不会被清空":"确认要删除案例？",confirmButtonText:"确定"});case 7:if(a=e.sent,1!==a){e.next=15;break}return Number(this.$route.params.id)===t&&("edit"===this.$route.query.type&&(canvas.clear().renderAll(),this.changeSketchGoods({type:"clear"})),i=this.$route.query,delete i["type"],delete i["time_stamp"],this.$router.replace({name:this.$route.name,query:i})),e.next=12,this.$axios.post(c["sceneMaterials"],{id:t});case 12:this.$emit("delete"),this.closeCaseDetail(),this.$toast.success("删除成功！");case 15:e.next=21;break;case 17:e.prev=17,e.t0=e["catch"](0),s=e.t0.msg,this.$toast.error(s);case 21:case"end":return e.stop()}},e,this,[[0,17]])}));function t(t){return e.apply(this,arguments)}return t}(),editCase:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.replace.remind||!canvas.getActiveObject()){e.next=9;break}return e.next=3,this.showReplaceModal({title:"替换确认",paragraph:"将替换当前画布的全部内容"});case 3:if(a=e.sent,a){e.next=6;break}return e.abrupt("return");case 6:this.$router.replace({name:this.$route.name,params:{id:t},query:Object(r["a"])({type:"edit",time_stamp:(new Date).getTime()},this.$route.query)}),e.next=10;break;case 9:this.$router.replace({name:this.$route.name,params:{id:t},query:Object(r["a"])({type:"edit",time_stamp:(new Date).getTime()},this.$route.query)});case 10:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}(),collectionCase:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(e.prev=0,t=this.caseDetail.is_collection,!t){e.next=7;break}return e.next=5,this.$axios.get(c["unCollectionCase"],{params:{id:this.id}});case 5:e.next=9;break;case 7:return e.next=9,this.$axios.get(c["collectionCase"],{params:{id:this.id}});case 9:this.caseDetail.is_collection=!t,e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](0),console.log(e.t0);case 15:case"end":return e.stop()}},e,this,[[0,12]])}));function t(){return e.apply(this,arguments)}return t}(),getCaseDetail:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(){var t,a,i;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.$axios.get(c["getSceneCaseDetail"],{params:{id:this.id}});case 3:t=e.sent,a=t.data,this.caseDetail=a,e.next=12;break;case 8:e.prev=8,e.t0=e["catch"](0),i=e.t0.msg,this.$toast.error(i);case 12:case"end":return e.stop()}},e,this,[[0,8]])}));function t(){return e.apply(this,arguments)}return t}(),openGoodDetail:function(e){var t=e.goods_id,a=e.key,i=e.is_buy;i&&this.changeSkuDetail({show:!0,id:t,key:a,dataSource:"caseGoods"})},closeCaseDetail:function(){this.changeCaseDetail({show:!1,id:""})},againCreation:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t,a){var i,s;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(i=this.$route.query,delete i["type"],this.replace.remind||!canvas.getActiveObject()){e.next=11;break}return e.next=5,this.showReplaceModal({title:"替换确认",paragraph:"将替换当前画布的全部内容"});case 5:if(s=e.sent,s){e.next=8;break}return e.abrupt("return");case 8:this.$router.replace({name:this.$route.name,params:{id:a},query:Object(r["a"])({},i,{time_stamp:(new Date).getTime()})}),e.next=12;break;case 11:this.$router.replace({name:this.$route.name,params:{id:a},query:Object(r["a"])({},i,{time_stamp:(new Date).getTime()})});case 12:case"end":return e.stop()}},e,this)}));function t(t,a){return e.apply(this,arguments)}return t}(),replaceImage:function(e,t){var a=this;if(this.matrix.show)this.$toast.message("请先取消变形");else{var i=canvas.getActiveObjects();if(0!==i.length)if(i.length>1)this.$toast.message("只能替换单个商品");else if("i-text"!==i[0].type){var s=u()();canvas.getActiveObjects().forEach(function(e){e.goods_id&&a.changeSketchGoods({type:"remove",uid:e.uid}),canvas.remove(e)}),canvas.discardActiveObject().renderAll(),fabric.Image.fromURL(e+"?imageslim&imageView2/0/w/1000",function(e){var n=i[0].scaleX*i[0].width/e.width,o=Object(r["a"])({},i[0],{width:e.width,height:e.height,scaleX:n,scaleY:n,_element:e._element,_originalElement:e._originalElement,goods_id:t.goods_id,goods_key:t.key,uid:s});e.set(Object(r["a"])({},o)),canvas.add(e),canvas.setActiveObject(e),a.changeSketchGoods({type:"set",good:Object(r["a"])({},t,{uid:s})}),a.updateHistory()},{crossOrigin:"anonymous"})}else this.$toast.message("文本不能被替换");else this.$toast.message("请先选中被替换的单品")}},addImage:function(e,t){var a=this,i=u()();fabric.Image.fromURL(e+"?imageslim&imageView2/0/w/1000",function(e){e.set({goods_id:t.goods_id,goods_key:t.key,left:100,top:100,uid:i}),e.scaleToWidth(300),canvas.add(e),canvas.setActiveObject(e),a.changeSketchGoods({type:"set",good:Object(r["a"])({},t,{uid:i})}),a.updateHistory()},{crossOrigin:"anonymous"})}}),computed:Object(r["a"])({},Object(o["c"])({show:function(e){return e.sketch.caseDetail.show},id:function(e){return e.sketch.caseDetail.id},matrix:function(e){return e.sketch.matrix},replace:function(e){return e.modal.replace}}))},p=d,h=(a("f43b"),a("17cc")),m=Object(h["a"])(p,i,s,!1,null,"39169f6f",null);t["default"]=m.exports},5428:function(e,t,a){var i=a("05ba"),s=a("97c1");function n(e,t,a){var n=t&&a||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null),e=e||{};var r=e.random||(e.rng||i)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t)for(var o=0;o<16;++o)t[n+o]=r[o];return t||s(r)}e.exports=n},"97c1":function(e,t){for(var a=[],i=0;i<256;++i)a[i]=(i+256).toString(16).substr(1);function s(e,t){var i=t||0,s=a;return[s[e[i++]],s[e[i++]],s[e[i++]],s[e[i++]],"-",s[e[i++]],s[e[i++]],"-",s[e[i++]],s[e[i++]],"-",s[e[i++]],s[e[i++]],"-",s[e[i++]],s[e[i++]],s[e[i++]],s[e[i++]],s[e[i++]],s[e[i++]]].join("")}e.exports=s},a8a5:function(e,t,a){},f43b:function(e,t,a){"use strict";var i=a("a8a5"),s=a.n(i);s.a}}]);
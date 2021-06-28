/* eslint-disable */

var dataImage = [
  require('../static/images/dp_icon_0.jpg'),
]
var SelectedIconImage = new Image();
SelectedIconImage.src = dataImage[0]

// fabric global
fabric.Object.prototype.setControlsVisibility({
  'tl': false,
  'tr': false,
  'bl': false,
  'br': false,
  'ml': false,
  'mt': false,
  'mr': false,
  'mb': false,
  'mtr': true
})
fabric.Object.prototype.set({
  borderOpacityWhenMoving: .5, // 移动图形时边框的透明度
  borderColor: '#333', // 选中图形时的边框颜色
  borderDashArray: [10, 10], // 有此值时边框为虚线，[10,10]表示虚线长10间隔10
  borderScaleFactor: 2, // 边框的粗细
  transparentCorners: true, // 边框拐角是否透明
  cornerStrokeColor: '#333', // 边框拐角颜色
  // cornerColor: '#fff', // 边框拐角背景色
  cornerSize: 25, // 边框拐角大小
  // padding: 20, // 边框距离图形的内边距
  lockScalingFlip: true, // 当true时，不能通过缩放为负值来翻转对象
  lockUniScaling: true // 当true时，对象非均匀缩放被锁定(只能等比缩放)
})

fabric.Object.prototype._drawControl = function(control, ctx, methodName, left, top, styleOverride) {
  styleOverride = styleOverride || {};
  if (!this.isControlVisible(control)) return;
  var size = this.cornerSize, stroke = !this.transparentCorners && this.cornerStrokeColor;
  ctx.drawImage(SelectedIconImage, left, top, size, size);
}

//override prorotype _setCornerCursor to change the corner cusrors
// fabric.Canvas.prototype._setCornerCursor = function(corner, target) {
//   if (corner === 'mtr' && target.hasRotatingPoint) {
//     this.setCursor(this.rotationCursor);
//     /*ADD*/
//   } else if (corner == "tr" || corner == "bl") {
//     this.setCursor('sw-resize');
//
//   } else if (corner == "tl" || corner == "br") {
//     this.setCursor('pointer');
//   }
//   /*ADD END*/
//   else {
//     this.setCursor(this.defaultCursor);
//     return false;
//   }
// };
// fabric.Canvas.prototype._getActionFromCorner = function(target, corner) {
//   var action = 'drag';
//   if (corner) {
//     switch (corner) {
//       case 'ml':
//       case 'mr':
//         action = 'scaleX';
//         break;
//       case 'mt':
//       case 'mb':
//         action = 'scaleY';
//         break;
//       case 'mtr':
//         action = 'rotate';
//         break;
//         /**ADD **/
//       case 'br':
//         action = 'rotate';
//         break;
//       case 'tl': //delete function if mouse down
//         action = 'delete';
//         canvas.remove(canvas.getActiveObject());
//         break;
//         /**ADD END**/
//       default:
//         action = 'scale';
//     }
//     return action;
//   }
// }

// fabric.Canvas.prototype._performTransformAction = function(e, transform, pointer) {
//   var x = pointer.x,
//       y = pointer.y,
//       action = transform.action,
//       actionPerformed = false,
//       options = {
//         target: transform.target,
//         e: e,
//         transform: transform,
//         pointer: pointer
//       };
//
//   if (action === 'rotate') {
//     (actionPerformed = this._rotateObject(x, y)) && this._fire('rotating', options);
//   }
//   else if (action === 'scale') {
//     (actionPerformed = this._onScale(e, transform, x, y)) && this._fire('scaling', options);
//   }
//   // else if (action === 'scaleX') {
//   //   (actionPerformed = this._scaleObject(x, y, 'x')) && this._fire('scaling', options);
//   // }
//   // else if (action === 'scaleY') {
//   //   (actionPerformed = this._scaleObject(x, y, 'y')) && this._fire('scaling', options);
//   // }
//   else if (action === 'skewX') {
//     (actionPerformed = this._skewObject(x, y, 'x')) && this._fire('skewing', options);
//   }
//   else if (action === 'skewY') {
//     (actionPerformed = this._skewObject(x, y, 'y')) && this._fire('skewing', options);
//   }
//   else {
//     actionPerformed = this._translateObject(x, y);
//     if (actionPerformed) {
//       this._fire('moving', options);
//       this.setCursor(options.target.moveCursor || this.moveCursor);
//     }
//   }
//   transform.actionPerformed = transform.actionPerformed || actionPerformed;
// }
//********override END*****//

export default fabric

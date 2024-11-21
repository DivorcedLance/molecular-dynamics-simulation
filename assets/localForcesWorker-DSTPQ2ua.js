(function(){"use strict";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const I="170",j="",f="srgb",q="srgb-linear",Z="linear",k="srgb";function X(y,t,s){return Math.max(t,Math.min(s,y))}class b{constructor(t,s,i,n,h,u,a,l,r){b.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,s,i,n,h,u,a,l,r)}set(t,s,i,n,h,u,a,l,r){const e=this.elements;return e[0]=t,e[1]=n,e[2]=a,e[3]=s,e[4]=h,e[5]=l,e[6]=i,e[7]=u,e[8]=r,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const s=this.elements,i=t.elements;return s[0]=i[0],s[1]=i[1],s[2]=i[2],s[3]=i[3],s[4]=i[4],s[5]=i[5],s[6]=i[6],s[7]=i[7],s[8]=i[8],this}extractBasis(t,s,i){return t.setFromMatrix3Column(this,0),s.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const s=t.elements;return this.set(s[0],s[4],s[8],s[1],s[5],s[9],s[2],s[6],s[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,s){const i=t.elements,n=s.elements,h=this.elements,u=i[0],a=i[3],l=i[6],r=i[1],e=i[4],c=i[7],_=i[2],o=i[5],x=i[8],z=n[0],m=n[3],M=n[6],g=n[1],d=n[4],C=n[7],p=n[2],S=n[5],F=n[8];return h[0]=u*z+a*g+l*p,h[3]=u*m+a*d+l*S,h[6]=u*M+a*C+l*F,h[1]=r*z+e*g+c*p,h[4]=r*m+e*d+c*S,h[7]=r*M+e*C+c*F,h[2]=_*z+o*g+x*p,h[5]=_*m+o*d+x*S,h[8]=_*M+o*C+x*F,this}multiplyScalar(t){const s=this.elements;return s[0]*=t,s[3]*=t,s[6]*=t,s[1]*=t,s[4]*=t,s[7]*=t,s[2]*=t,s[5]*=t,s[8]*=t,this}determinant(){const t=this.elements,s=t[0],i=t[1],n=t[2],h=t[3],u=t[4],a=t[5],l=t[6],r=t[7],e=t[8];return s*u*e-s*a*r-i*h*e+i*a*l+n*h*r-n*u*l}invert(){const t=this.elements,s=t[0],i=t[1],n=t[2],h=t[3],u=t[4],a=t[5],l=t[6],r=t[7],e=t[8],c=e*u-a*r,_=a*l-e*h,o=r*h-u*l,x=s*c+i*_+n*o;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const z=1/x;return t[0]=c*z,t[1]=(n*r-e*i)*z,t[2]=(a*i-n*u)*z,t[3]=_*z,t[4]=(e*s-n*l)*z,t[5]=(n*h-a*s)*z,t[6]=o*z,t[7]=(i*l-r*s)*z,t[8]=(u*s-i*h)*z,this}transpose(){let t;const s=this.elements;return t=s[1],s[1]=s[3],s[3]=t,t=s[2],s[2]=s[6],s[6]=t,t=s[5],s[5]=s[7],s[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const s=this.elements;return t[0]=s[0],t[1]=s[3],t[2]=s[6],t[3]=s[1],t[4]=s[4],t[5]=s[7],t[6]=s[2],t[7]=s[5],t[8]=s[8],this}setUvTransform(t,s,i,n,h,u,a){const l=Math.cos(h),r=Math.sin(h);return this.set(i*l,i*r,-i*(l*u+r*a)+u+t,-n*r,n*l,-n*(-r*u+l*a)+a+s,0,0,1),this}scale(t,s){return this.premultiply(E.makeScale(t,s)),this}rotate(t){return this.premultiply(E.makeRotation(-t)),this}translate(t,s){return this.premultiply(E.makeTranslation(t,s)),this}makeTranslation(t,s){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,s,0,0,1),this}makeRotation(t){const s=Math.cos(t),i=Math.sin(t);return this.set(s,-i,0,i,s,0,0,0,1),this}makeScale(t,s){return this.set(t,0,0,0,s,0,0,0,1),this}equals(t){const s=this.elements,i=t.elements;for(let n=0;n<9;n++)if(s[n]!==i[n])return!1;return!0}fromArray(t,s=0){for(let i=0;i<9;i++)this.elements[i]=t[i+s];return this}toArray(t=[],s=0){const i=this.elements;return t[s]=i[0],t[s+1]=i[1],t[s+2]=i[2],t[s+3]=i[3],t[s+4]=i[4],t[s+5]=i[5],t[s+6]=i[6],t[s+7]=i[7],t[s+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const E=new b,Q={enabled:!0,workingColorSpace:q,spaces:{},convert:function(y,t,s){return this.enabled===!1||t===s||!t||!s||(this.spaces[t].transfer===k&&(y.r=A(y.r),y.g=A(y.g),y.b=A(y.b)),this.spaces[t].primaries!==this.spaces[s].primaries&&(y.applyMatrix3(this.spaces[t].toXYZ),y.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===k&&(y.r=T(y.r),y.g=T(y.g),y.b=T(y.b))),y},fromWorkingColorSpace:function(y,t){return this.convert(y,this.workingColorSpace,t)},toWorkingColorSpace:function(y,t){return this.convert(y,t,this.workingColorSpace)},getPrimaries:function(y){return this.spaces[y].primaries},getTransfer:function(y){return y===j?Z:this.spaces[y].transfer},getLuminanceCoefficients:function(y,t=this.workingColorSpace){return y.fromArray(this.spaces[t].luminanceCoefficients)},define:function(y){Object.assign(this.spaces,y)},_getMatrix:function(y,t,s){return y.copy(this.spaces[t].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(y){return this.spaces[y].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(y=this.workingColorSpace){return this.spaces[y].workingColorSpaceConfig.unpackColorSpace}};function A(y){return y<.04045?y*.0773993808:Math.pow(y*.9478672986+.0521327014,2.4)}function T(y){return y<.0031308?y*12.92:1.055*Math.pow(y,.41666)-.055}const Y=[.64,.33,.3,.6,.15,.06],N=[.2126,.7152,.0722],L=[.3127,.329],B=new b().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),P=new b().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Q.define({[q]:{primaries:Y,whitePoint:L,transfer:Z,toXYZ:B,fromXYZ:P,luminanceCoefficients:N,workingColorSpaceConfig:{unpackColorSpace:f},outputColorSpaceConfig:{drawingBufferColorSpace:f}},[f]:{primaries:Y,whitePoint:L,transfer:k,toXYZ:B,fromXYZ:P,luminanceCoefficients:N,outputColorSpaceConfig:{drawingBufferColorSpace:f}}});class D{constructor(t=0,s=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=s,this._z=i,this._w=n}static slerpFlat(t,s,i,n,h,u,a){let l=i[n+0],r=i[n+1],e=i[n+2],c=i[n+3];const _=h[u+0],o=h[u+1],x=h[u+2],z=h[u+3];if(a===0){t[s+0]=l,t[s+1]=r,t[s+2]=e,t[s+3]=c;return}if(a===1){t[s+0]=_,t[s+1]=o,t[s+2]=x,t[s+3]=z;return}if(c!==z||l!==_||r!==o||e!==x){let m=1-a;const M=l*_+r*o+e*x+c*z,g=M>=0?1:-1,d=1-M*M;if(d>Number.EPSILON){const p=Math.sqrt(d),S=Math.atan2(p,M*g);m=Math.sin(m*S)/p,a=Math.sin(a*S)/p}const C=a*g;if(l=l*m+_*C,r=r*m+o*C,e=e*m+x*C,c=c*m+z*C,m===1-a){const p=1/Math.sqrt(l*l+r*r+e*e+c*c);l*=p,r*=p,e*=p,c*=p}}t[s]=l,t[s+1]=r,t[s+2]=e,t[s+3]=c}static multiplyQuaternionsFlat(t,s,i,n,h,u){const a=i[n],l=i[n+1],r=i[n+2],e=i[n+3],c=h[u],_=h[u+1],o=h[u+2],x=h[u+3];return t[s]=a*x+e*c+l*o-r*_,t[s+1]=l*x+e*_+r*c-a*o,t[s+2]=r*x+e*o+a*_-l*c,t[s+3]=e*x-a*c-l*_-r*o,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,s,i,n){return this._x=t,this._y=s,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,s=!0){const i=t._x,n=t._y,h=t._z,u=t._order,a=Math.cos,l=Math.sin,r=a(i/2),e=a(n/2),c=a(h/2),_=l(i/2),o=l(n/2),x=l(h/2);switch(u){case"XYZ":this._x=_*e*c+r*o*x,this._y=r*o*c-_*e*x,this._z=r*e*x+_*o*c,this._w=r*e*c-_*o*x;break;case"YXZ":this._x=_*e*c+r*o*x,this._y=r*o*c-_*e*x,this._z=r*e*x-_*o*c,this._w=r*e*c+_*o*x;break;case"ZXY":this._x=_*e*c-r*o*x,this._y=r*o*c+_*e*x,this._z=r*e*x+_*o*c,this._w=r*e*c-_*o*x;break;case"ZYX":this._x=_*e*c-r*o*x,this._y=r*o*c+_*e*x,this._z=r*e*x-_*o*c,this._w=r*e*c+_*o*x;break;case"YZX":this._x=_*e*c+r*o*x,this._y=r*o*c+_*e*x,this._z=r*e*x-_*o*c,this._w=r*e*c-_*o*x;break;case"XZY":this._x=_*e*c-r*o*x,this._y=r*o*c-_*e*x,this._z=r*e*x+_*o*c,this._w=r*e*c+_*o*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return s===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,s){const i=s/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const s=t.elements,i=s[0],n=s[4],h=s[8],u=s[1],a=s[5],l=s[9],r=s[2],e=s[6],c=s[10],_=i+a+c;if(_>0){const o=.5/Math.sqrt(_+1);this._w=.25/o,this._x=(e-l)*o,this._y=(h-r)*o,this._z=(u-n)*o}else if(i>a&&i>c){const o=2*Math.sqrt(1+i-a-c);this._w=(e-l)/o,this._x=.25*o,this._y=(n+u)/o,this._z=(h+r)/o}else if(a>c){const o=2*Math.sqrt(1+a-i-c);this._w=(h-r)/o,this._x=(n+u)/o,this._y=.25*o,this._z=(l+e)/o}else{const o=2*Math.sqrt(1+c-i-a);this._w=(u-n)/o,this._x=(h+r)/o,this._y=(l+e)/o,this._z=.25*o}return this._onChangeCallback(),this}setFromUnitVectors(t,s){let i=t.dot(s)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*s.z-t.z*s.y,this._y=t.z*s.x-t.x*s.z,this._z=t.x*s.y-t.y*s.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(X(this.dot(t),-1,1)))}rotateTowards(t,s){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,s/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,s){const i=t._x,n=t._y,h=t._z,u=t._w,a=s._x,l=s._y,r=s._z,e=s._w;return this._x=i*e+u*a+n*r-h*l,this._y=n*e+u*l+h*a-i*r,this._z=h*e+u*r+i*l-n*a,this._w=u*e-i*a-n*l-h*r,this._onChangeCallback(),this}slerp(t,s){if(s===0)return this;if(s===1)return this.copy(t);const i=this._x,n=this._y,h=this._z,u=this._w;let a=u*t._w+i*t._x+n*t._y+h*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=u,this._x=i,this._y=n,this._z=h,this;const l=1-a*a;if(l<=Number.EPSILON){const o=1-s;return this._w=o*u+s*this._w,this._x=o*i+s*this._x,this._y=o*n+s*this._y,this._z=o*h+s*this._z,this.normalize(),this}const r=Math.sqrt(l),e=Math.atan2(r,a),c=Math.sin((1-s)*e)/r,_=Math.sin(s*e)/r;return this._w=u*c+this._w*_,this._x=i*c+this._x*_,this._y=n*c+this._y*_,this._z=h*c+this._z*_,this._onChangeCallback(),this}slerpQuaternions(t,s,i){return this.copy(t).slerp(s,i)}random(){const t=2*Math.PI*Math.random(),s=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),h=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),h*Math.sin(s),h*Math.cos(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,s=0){return this._x=t[s],this._y=t[s+1],this._z=t[s+2],this._w=t[s+3],this._onChangeCallback(),this}toArray(t=[],s=0){return t[s]=this._x,t[s+1]=this._y,t[s+2]=this._z,t[s+3]=this._w,t}fromBufferAttribute(t,s){return this._x=t.getX(s),this._y=t.getY(s),this._z=t.getZ(s),this._w=t.getW(s),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,s=0,i=0){w.prototype.isVector3=!0,this.x=t,this.y=s,this.z=i}set(t,s,i){return i===void 0&&(i=this.z),this.x=t,this.y=s,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,s){switch(t){case 0:this.x=s;break;case 1:this.y=s;break;case 2:this.z=s;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,s){return this.x=t.x+s.x,this.y=t.y+s.y,this.z=t.z+s.z,this}addScaledVector(t,s){return this.x+=t.x*s,this.y+=t.y*s,this.z+=t.z*s,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,s){return this.x=t.x-s.x,this.y=t.y-s.y,this.z=t.z-s.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,s){return this.x=t.x*s.x,this.y=t.y*s.y,this.z=t.z*s.z,this}applyEuler(t){return this.applyQuaternion(V.setFromEuler(t))}applyAxisAngle(t,s){return this.applyQuaternion(V.setFromAxisAngle(t,s))}applyMatrix3(t){const s=this.x,i=this.y,n=this.z,h=t.elements;return this.x=h[0]*s+h[3]*i+h[6]*n,this.y=h[1]*s+h[4]*i+h[7]*n,this.z=h[2]*s+h[5]*i+h[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const s=this.x,i=this.y,n=this.z,h=t.elements,u=1/(h[3]*s+h[7]*i+h[11]*n+h[15]);return this.x=(h[0]*s+h[4]*i+h[8]*n+h[12])*u,this.y=(h[1]*s+h[5]*i+h[9]*n+h[13])*u,this.z=(h[2]*s+h[6]*i+h[10]*n+h[14])*u,this}applyQuaternion(t){const s=this.x,i=this.y,n=this.z,h=t.x,u=t.y,a=t.z,l=t.w,r=2*(u*n-a*i),e=2*(a*s-h*n),c=2*(h*i-u*s);return this.x=s+l*r+u*c-a*e,this.y=i+l*e+a*r-h*c,this.z=n+l*c+h*e-u*r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const s=this.x,i=this.y,n=this.z,h=t.elements;return this.x=h[0]*s+h[4]*i+h[8]*n,this.y=h[1]*s+h[5]*i+h[9]*n,this.z=h[2]*s+h[6]*i+h[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,s){return this.x=Math.max(t.x,Math.min(s.x,this.x)),this.y=Math.max(t.y,Math.min(s.y,this.y)),this.z=Math.max(t.z,Math.min(s.z,this.z)),this}clampScalar(t,s){return this.x=Math.max(t,Math.min(s,this.x)),this.y=Math.max(t,Math.min(s,this.y)),this.z=Math.max(t,Math.min(s,this.z)),this}clampLength(t,s){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(s,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,s){return this.x+=(t.x-this.x)*s,this.y+=(t.y-this.y)*s,this.z+=(t.z-this.z)*s,this}lerpVectors(t,s,i){return this.x=t.x+(s.x-t.x)*i,this.y=t.y+(s.y-t.y)*i,this.z=t.z+(s.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,s){const i=t.x,n=t.y,h=t.z,u=s.x,a=s.y,l=s.z;return this.x=n*l-h*a,this.y=h*u-i*l,this.z=i*a-n*u,this}projectOnVector(t){const s=t.lengthSq();if(s===0)return this.set(0,0,0);const i=t.dot(this)/s;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return R.copy(this).projectOnVector(t),this.sub(R)}reflect(t){return this.sub(R.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const s=Math.sqrt(this.lengthSq()*t.lengthSq());if(s===0)return Math.PI/2;const i=this.dot(t)/s;return Math.acos(X(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const s=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return s*s+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,s,i){const n=Math.sin(s)*t;return this.x=n*Math.sin(i),this.y=Math.cos(s)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,s,i){return this.x=t*Math.sin(s),this.y=i,this.z=t*Math.cos(s),this}setFromMatrixPosition(t){const s=t.elements;return this.x=s[12],this.y=s[13],this.z=s[14],this}setFromMatrixScale(t){const s=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=s,this.y=i,this.z=n,this}setFromMatrixColumn(t,s){return this.fromArray(t.elements,s*4)}setFromMatrix3Column(t,s){return this.fromArray(t.elements,s*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,s=0){return this.x=t[s],this.y=t[s+1],this.z=t[s+2],this}toArray(t=[],s=0){return t[s]=this.x,t[s+1]=this.y,t[s+2]=this.z,t}fromBufferAttribute(t,s){return this.x=t.getX(s),this.y=t.getY(s),this.z=t.getZ(s),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,s=Math.random()*2-1,i=Math.sqrt(1-s*s);return this.x=i*Math.cos(t),this.y=s,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const R=new w,V=new D;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:I}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=I),self.onmessage=y=>{const{atoms:t,neighbors:s,springConstant:i,rotationalConstant:n}=y.data,h={},u=new Map(t.map(a=>[a.id,a]));s.forEach(({id:a,neighbors:l})=>{const r=u.get(a);if(!r)return;const e=new w;l.forEach(c=>{const _=u.get(c);if(!_)return;const o=1,x=new w(...r.position),z=new w(..._.position),m=x.distanceTo(z)-o,M=new w().subVectors(z,x).normalize().multiplyScalar(-i*m);e.add(M);const g=new w(-(z.y-x.y),z.x-x.x,0).normalize().multiplyScalar(n);e.add(g)}),h[a]=[e.x,e.y,e.z]}),postMessage(h)}})();

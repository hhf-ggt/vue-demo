/** 
 * 学习vue中utils的方法
 * 原utils是使用flow进行的类型检测
*/



/**
 * 冻住一个对象使其无法更改和操作对象，也不可以操作其原型上的方法
*/
export const emptyObject = Object.freeze({});


/**
 * 判断是否是undefined || null
 * return boolean
*/
export function isUndef(v) {
    return v === undefined || v === null
}

export function isTrue(v) {
    return v === true
}

export function isFalse(v) {
    return v === false
}

/**
 * 判断value是否是原始值 string number boolean symbol
 */

export function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * 是否是对象
*/

export function isObject(obj) {
    return obj !== null &&  typeof obj === 'object'
}

// 定义一个私有变量
const _toString = Object.prototype.toString

// 从字符串[objet object] 中得到字符串 object

export function toRawType(value) {
    return _toString.call(value).slice(8, -1)
    // 得到"[object String]" => String
    // 这个小技巧就是无论你前面有多少项 我只要去掉最后一项就好了
}

// 判断是否是对象

export function isPlainObject(obj) {
    return _toString.call(obj) === '[object object]'
}

// 判断是正则

export function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
}

// isFinite是否是有限的数字 返回 boolean

// 验证是否是数组的有效index值

export function isValidArrayIndex(val) {
    const n = parseFloat(String(val));
    // 从左向右找到第一个不是为数字的截取
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 判断是不是promise

export function isPromise(val) {
    return (
        isDef(val) && 
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
    )
}

// 将值转换为字符串
// JSON.stringify 的参数 可以指定值的 第二个参数是 函数  第三个是空白格的个数 
// 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
// 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
//如果该参数为 null 或者未提供，则对象所有的属性都会被序列化
// 如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，
//则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），
//该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。
export function toString(val) {
    return val === null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
}


// 将输入的值转换为number类型

export function toNumber(val) {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}


// 利用闭包实现一个缓存机制
// 第二个参数可以实现是否区分大小写的 是一个boolean值

export function makeMap(str, expectsLowerCase) {
    const map = Object.create(null)
    const list = str.split(',')

    for(let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

/**
 * eg：
 * let myFunc = makeMap('张三， 李四， 王麻子')
 * myFunc('张三')
 * return true
 * */

// 从数组中删除一项

export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

// 判断一个属性是不是对象自身的属性而不会从原型链上去找
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

// 创建一个纯函数的缓存版本
// 加入我们有一个fn 函数是 function fn(str) { return str.toLoweCase() };
// 后面我们会用一个变量来接收cached函数返回来的函数 每次将我们执行的值 缓存起来 这样可以极大的提高性能

export function cached(fn) {
    const cache = Object.create(null)
    return (
        function cachedFn(str) {
            const hit = cache[str]
            return hit || (cache[str] = fn(str))
        }
    )
}


// 驼峰
const cameLizeRE = /-(\w)/g

export const camelize = cached(str, () => {
    return str.replace(cameLizeRE, (_, c) => c ? c.toUpperCase() : '')
})

// 将首字母大写
export const capitalize = cached(str,() => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

// 大写转连字符

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached(str, () => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

// 什么也不干

export function noop (a, b, c) {}
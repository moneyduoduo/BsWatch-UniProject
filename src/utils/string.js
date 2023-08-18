/**
 * @description 对象转为查询字符串
 * @param obj 要转成查询字符串的对象
 * @return 返回转化后的查询字符串，如果是空对象或者传入的对象有误则返回空字符串
 * @example
 *
 *    param({ age: 18, name: 'lily', msg: 'hello' });
 *    // => age=18&name=lily&msg=hello
 */
 export const paramToStr = obj => {
    if(Object.keys(obj || {}).length) {
      return Object.entries(obj).map(p => p.join('=')).join('&');
    }
    return '';
  };
  
  /**
   * 获取url的查询部分
   * @param url {string} 要查询的url
   * @return 以对象的形式返回参数，如果传入的参数不对或其他错误则返回空对象
   */
  export const getUrlParam = url => {
    const searchPatt = url?.split('?') || [];
    let search;
    if(searchPatt.length > 2) {
      const [name, ...s] = searchPatt;
      search = s.join('&');
    } else {
      search = searchPatt[1];
    }
    if(!search) return {};
    let params = {};
    const searchArr = search ? search.split('&') : [];
    searchArr.forEach(paramStr => {
      const [key, value] = paramStr.split('=');
      params[key] = value;
    });
    return params;
  };
  
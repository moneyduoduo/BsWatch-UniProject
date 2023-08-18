import dayjs from 'dayjs';

export const andObj = (...objs) => Object.assign({}, ...objs);

/**
 *
 * @param obj1 {Object}
 * @param obj2 {Object}
 * @return {boolean}
 */
export const equalObj = (obj1, obj2) => {
  const len1 = Object.keys(obj1).length;
  const len2 = Object.keys(obj2).length;
  if(len1 === len2) {
    let is = true;
    for(const key in obj1) {
      is = is && obj1[key] === obj2[key];
    }
    return is;
  }
  return false;
};

/**
 * 获取对象指定的key
 * @param keys {Array<string>}
 * @param obj {Object}
 * @return {Object}
 */
export const getObj = (keys, obj) => {
  let result = {};
  if(!Array.isArray(keys)) return result;
  for(const i in keys) {
    const key = keys[i];
    result[key] = obj[key];
  }
  return result;
};

export const filterObj = (callback, obj) => {
  let result = {};
  for(const key in obj) {
    if(callback(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const everyObj = (callback, obj) => {
  let jump = true;
  for(const key in obj) {
    jump = jump && callback(obj[key], key);
  }
  return jump;
};

export const mapObj = (callback, obj) => {
  let result = {};
  for(const key in obj) {
    result[key] = callback(obj[key], key);
  }
  return result;
};

/**
 * 判断对象是否包含空值
 * @param obj {Object}
 * @param toast {Boolean} 是否显示提示
 * @return {Boolean}
 */
export const hasNullObj = (obj, toast = false) => {
  for(const key in obj) {
    if(!obj[key] && obj[key] !== 0 && obj[key] !== false) {
      if(toast && obj[key].toast) {
        uni.showToast({ title: obj[key].toast, icon: 'none' });
      }
      return false;
    }
  }
  return true;
};

/**
 * 处理获取的消息列表 将列表信息归类通过一个字段 最后解析成一个对象
 * @param {Object} data 目标数据
 * @param {Array} handleData 将要归类处理的数组
 * @param {String} filed 归类字段
 * @param {String} type 特殊处理 如果已时间分类
 **/
export const classificationArrToObj = (
    handleData, filed, type = '', data = {}) => {
  if(handleData && handleData.length > 0) {
    let key = filed;
    let obj = handleData.reduce((last, item) => {
      if(type === 'date') {
        key = new Date(item[filed]);
      } else if(type === 'year') {
        key = dayjs(item[filed]).format('YYYY');
      } else if(type === 'years') {
        key = dayjs(item[filed]).format('YYYY年MM月DD日');
      } else {
        key = item[filed];
      }
      if(last[key]) {
        last[key].push(item);
      } else {
        last[key] = [item];
      }
      return last;
    }, {});
    for(let key1 in data) {
      for(let key2 in obj) {
        if(key1 === key2) {
          obj[key2].push(...data[key1]);
        }
      }
    }
    data = { ...data, ...obj };
    return data;
  }
};

/**
 * 获取将两个时间相差的 天时分
 * @param {number || string} beginDt 时间戳 || 字符串 开始时间
 * @param {number || string} endDt 时间戳 || 字符串 结束时间
 * @return {number || string} 格式化后的时间  1天2时3分
 */
export const formatTimeToDayStr = (beginDt, endDt) => {
  let beginTime = beginDt;
  let endTime = endDt;
  let diffTime = 0;
  if(typeof beginDt === 'string') {
    beginTime = new Date(beginTime.replace(/-/g, '/')).getTime();
  }
  if(typeof endDt === 'string') {
    endTime = new Date(endTime.replace(/-/g, '/')).getTime();
  }
  diffTime = endTime - beginTime;
  if(diffTime > 0) {
    let day = parseInt(diffTime / (24 * 60 * 60 * 1000));
    let hour = parseInt((diffTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minute = parseInt((diffTime % (60 * 60 * 1000)) / (60 * 1000));
    return `${ day }天 ${ hour }小时 ${ minute }分钟`;
  } else {
    return '0天';
  }
};
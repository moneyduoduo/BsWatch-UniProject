import request from './index.js';

/* 血糖数据上传 */
export const sycAndUpload = (userId, data) => {
	// console.log('?sycAndUpload');
	// console.log(data[0]);
	// console.log(data.length);
	// console.log(data);

	// return
	// data = [{
	// 		"transmitterId": "JN-N3N1402",
	// 		"uploadTime": "2023-08-14 18:55:25",
	// 		"dateStr": "2023-08-16 14:59:19",
	// 		"startTime": 1690855879000,
	// 		"time": 1692169159000,
	// 		"value": 12,
	// 		"idWithinSession": 0,
	// 		"isAbnormal": false,
	// 		"isCalibration": false,
	// 		"rawValue": 0.10000000149011612,
	// 		"trend": 0,
	// 		"unitsOfMeasure": 1
	// 	},
	// 	{
	// 		"transmitterId": "JN-N3N1402",
	// 		"uploadTime": "2023-08-14 18:55:25",
	// 		"dateStr": "2023-08-16 14:59:22",
	// 		"startTime": 1690855879000,
	// 		"time": 1692169162000,
	// 		"value": 24,
	// 		"idWithinSession": 1,
	// 		"isAbnormal": false,
	// 		"isCalibration": false,
	// 		"rawValue": 0.07000000029802322,
	// 		"trend": 0,
	// 		"unitsOfMeasure": 1
	// 	}
	// ]
	return request.post({
		url: `measurements/bloodGlucose/${userId}/batch`,
		data
	});
};


/* 获取版本信息 */
export const getVersion = () => {
	return request.post2({
		url: `https://dv.digitalvillages.com.cn/checkVersion`
	});
};
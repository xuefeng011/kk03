'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event.data)
	//返回数据给客户端

	if (event.type == "list") {

		let req = `?fid=${event.fid}&page=${event.page}&limit=${event.limit}&order=0&system=wechat&sign=${event.sign}`

		const res = await uniCloud.httpclient.request(
			'https://ssl-club-api-ios-1.kdslife.com/index.php/forum' + req, {
				method: 'GET',
				data: {},
				dataType: 'json'
			});

		const success = res.status === 200
		if (success) {
			return {
				status: 1,
				datas: res.data
			}
		} else {
			return {
				status: -1,
				datas: res
			}
		}

	} else {
		let req2 = `?bbsId=${event.id}&page=${event.page}&limit=${event.limit}&order=0&system=wechat&sign=${event.sign}`

		const res2 = await uniCloud.httpclient.request(
			'https://ssl-club-api-ios-1.kdslife.com/index.php/thread' + req2, {
				method: 'GET',
				data: {},
				dataType: 'json'
			});

		const success = res2.status === 200
		if (success) {
			return {
				status: 1,
				datas: res2.data
			}
		} else {
			return {
				status: -1,
				datas: res2
			}
		}
	}

};

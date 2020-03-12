function getBBsApi(data, cloudfunctionname = "dbhelper") {
	console.log("xxx",data)
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: cloudfunctionname,
			data: data,
			success: res => {
				console.log("succ",res)
				if(res.success && res.result.status==1){
						return resolve(res.result.datas)
				}else{
					return reject("error")
				}
			},
			fail: err => {
				// console.error('[云函数] [dbhelper] 调用失败',err)
				return reject('[云函数] [dbhelper] 调用失败 ' + JSON.stringify(err))
			}
		})

	})
}

export {
	getBBsApi
}

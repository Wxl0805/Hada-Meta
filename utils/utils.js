// 图片压缩递归，小于1M跳出
let count = 0;
export function  imageCompress(file){
	return new Promise((resolve, reject)=>{
		count = count+1;
		if(count >6) {
			resolve(file);
			count = 0;
			return false;
		}
		let { size,path } = file;
		if(size< (1024*1024*2)){
			resolve(file);
			count = 0;
			return false;
		}
		uni.compressImage({
			src: path,
			quality: 50,
			success: res => {
				let newPath = res.tempFilePath
				let newName = res.tempFilePath.split("/")[res.tempFilePath.split("/").length-1]
				uni.getFileInfo({
					filePath:res.tempFilePath,
					success:async (info)=>{
						if(info.size == size) {
							resolve(file);
							count = 0;
							return false;
						}
						let newFile = {...file,size:info.size,path:newPath,name:newName,tempFilePath:res.tempFilePath}
						resolve(await imageCompress(newFile))
					}
				})
			}
		})

	})

}
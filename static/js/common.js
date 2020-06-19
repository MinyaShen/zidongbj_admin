// 公用方法封装

// 域名地址配置
var baseUrl = 'http://192.168.0.27/alarm'
var imgBaseUrl = 'http://192.168.0.27'

// 时间按戳转换成具体时间格式
function formatTime (Timestamp) {
	return new Date(parseInt(Timestamp)).toLocaleString()
}
/**重写toLocaleString方法*/
Date.prototype.toLocaleString = function() {
	var y = this.getFullYear();  
	var m = this.getMonth()+1;  
	m = m<10?'0'+m:m;  
	var d = this.getDate();  
	d = d<10?("0"+d):d;  
	var h = this.getHours();  
	h = h<10?("0"+h):h;  
	var M = this.getMinutes();  
	M = M<10?("0"+M):M;  
	var S=this.getSeconds();
	S=S<10?("0"+S):S;  
	return y+"-"+m+"-"+d+" "+h+":"+M+":"+S; 
};

// 获取URL参数
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); 
	return null; 
}

// ajax请求
function ajaxfuntion($,url,todata,type,fun) {
	$.ajax({
	url: url,
	data:todata,
	type: type,
	dataType: 'json',
	success: fun
	});
}

// 带token的ajax请求
function ajaxsessionfuntion($,url,todata,type,fun) {
	$.ajax({
	url: url,
	data:todata,
	type: type,
	dataType: 'json',
	beforeSend:function(xhr)
	{
		xhr.setRequestHeader("token",localStorage.getItem("drugtoken"));
	},
	success: fun
	});
}

// layui 文件上传封装
function layuiImagepost(upload, $, imagediv, url, dataparams) {
	var uploadInst = upload.render({
		elem: imagediv
		,url: url
		//,data:datas
		,before: function(obj){
			this.data = dataparams;
			obj.preview(function(index, file, result){
			$(imagediv).attr('src', result); //图片链接（base64）
			});
		}
	 ,done: function(res){
		layer.msg(res.msg);
		$(imagediv).attr("src", res.data.img.outUrl);
		 }
	});
}

// layui 表单创建封装
function createTable(table, dataurl, wheres, colsarray, pageflags, id, layer) {
	return table.render({
		elem: id
		,url:dataurl
		,where: wheres
		,cols: colsarray
		,page: pageflags
		,response: {
			statusName: 'status' //数据状态的字段名称，默认：code
			,statusCode: 1 //成功的状态码，默认：0
			,msgName: 'msg' //状态信息的字段名称，默认：msg
			,countName: 'total' //数据总数的字段名称，默认：count
			,dataName: 'data' //数据列表的字段名称，默认：data
		}
		,done: function(res){
			layer.msg(res.msg);
		}
	});
}
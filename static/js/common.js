// 公用方法封装

// 域名地址配置
// var baseUrl = 'https://jszzkj.cn/alarm'
// var imgBaseUrl = 'https://jszzkj.cn'
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

// 检查cookie
function check() {
 pre_url = window.frames['fjob'].document.location;
 setCookie('pre_url', pre_url, 1);
}
// 获取cookie
function getCookie(c_name) {
 if (document.cookie.length>0) {
   c_start=document.cookie.indexOf(c_name + "=")
   if (c_start!=-1) { 
		c_start=c_start + c_name.length+1 
		c_end=document.cookie.indexOf(";",c_start)
		if (c_end==-1) c_end=document.cookie.length
		return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}
// 设置cookie
function setCookie(c_name,value,expiredays) {
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

// 返回上级页面
function goBack ($, elem) {
	$(elem).click(function () {
		window.history.go(-1)
	})
}

// ajax请求
function ajaxfuntion($, url, todata, type, s_fun, e_fun, c_fun) {
	$.ajax({
	url: url,
	data:todata,
	type: type,
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	success: s_fun,
	error: e_fun,
	complete: c_fun
	});
}

// 带token的ajax请求
function ajaxsessionfuntion($, url, todata, type, s_fun, e_fun, c_fun) {
	$.ajax({
	url: url,
	data:todata,
	type: type,
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	beforeSend:function(xhr)
	{
		xhr.setRequestHeader("token",localStorage.getItem("drugtoken"));
	},
	success: s_fun,
	error: e_fun,
	complete: c_fun
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


// 取平均数
function avg(x,y){
	return (parseFloat(x)+parseFloat(y))/2 ;
}
let request = require('request');
let body = [];
let auth = "konsmjazSEAD:ca5f8bfa-16aa-435e-a1d4-fdde8c812781";
let coded_auth = Buffer.from(auth).toString("base64");
request({
	method: 'PUT',
	url: 'https://restapi3.jasper.com/rws/api/v1/devices/89462036051001561445',
	headers : {
                "Accept": "application/json",
                "Authorization": "Basic " + coded_auth},
	body: {"customerCustom1":"A message"},
	json: true
},
	function (error, response, body) {
		if(error) {
			console.log('Error:', error);
			return;
		} else {
			// return statusCode
			console.log(response.statusCode); 
			// return contentType
			console.log(response.headers['content-type']); 
			console.log(body);
		}
	}
)

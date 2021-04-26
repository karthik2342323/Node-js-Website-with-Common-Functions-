
var EM = {};
module.exports = EM;

//  smtp(Simple mail transfer protocol) server setup

/*
Note : Gmail will not allow using its smtp from less secured apps. You might need to switch off that feature while testing to send email. 
In gmail, my account goto Sign-in & Security --> Connected apps & sites --> Allow less secure apps: turn it on
*/
EM.server = require("emailjs/email").server.connect(
{
	host 	    : process.env.NL_EMAIL_HOST || 'smtp.gmail.com',
	user 	    : process.env.NL_EMAIL_USER || 'Ur EmailID(Gmail)',
	password    : process.env.NL_EMAIL_PASS || 'Your Passwd',
	ssl		    : true ,

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	// for debugging
	var x= process.env.NL_EMAIL_FROM || 'Node Login <do-not-reply@gmail.com>';
	console.log(" See This Email : "+x);
	// for debugging

	EM.server.send({
		from         : process.env.NL_EMAIL_FROM || 'Node Login <do-not-reply@gmail.com>',
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	let baseurl = process.env.NL_SITE_URL || 'http://localhost:3000';
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+baseurl+'/reset-password?key='+o.passKey+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://velanovehicle.000webhostapp.com/'>from Karthik</a><br><br>";
		html += "</body></html>";
	return [{data:html, alternative:true}];
}


// authentication OTP
EM.Authenticaton = function(data, callback)
{
	// for debugging
	var x= process.env.NL_EMAIL_FROM || 'Node Login <do-not-reply@gmail.com>';
	console.log(" See This Email : "+x);
	// for debugging

	EM.server.send({
		from         : process.env.NL_EMAIL_FROM || 'Node Login <do-not-reply@gmail.com>',
		to           : data.email,
		subject      : 'Authentication',
		text         : ' Verify User',
		attachment   : EM.composerAuthentication(data.name,data.otp)
	}, callback );
};

EM.composerAuthentication = function(name,otp)
{
	//let baseurl = process.env.NL_SITE_URL || 'http://localhost:3000';
	var html = "<html><body>";
	html += "Hi "+name+",<br><br>";
	html += " <h4> This is Ur <B>"+otp+"<B>  Otp </h4>";
	html += "<a href='http://velanovehicle.000webhostapp.com/'>from Karthik</a><br><br>";
	html += "</body></html>";
	return [{data:html, alternative:true}];
};

// authentication otp
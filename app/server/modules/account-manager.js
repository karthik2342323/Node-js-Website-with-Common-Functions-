
const crypto 		= require('crypto');
const moment 		= require('moment');
const MongoClient 	= require('mongodb').MongoClient;

var EM = require('./email-dispatcher');

var db, accounts , cancer_data , loginToken;
// process.env.DB_URL This var is present in app.js as an thise are environment var So basically anyone can access It
MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function(e, client) {
	if (e){
		console.log(e);
	}	else{
		db = client.db(process.env.DB_NAME);
		accounts = db.collection('accounts');
		cancer_data=db.collection('cancer_data');
		loginToken=db.collection('loginToken');

		// for debugging

		var x={'x':1,'y':2};
		/*
		console.log(" See This Data : "+accounts.find({},function (error,data) {
			if(error!=null)
			{
				console.log(" Error While Fetching Data")
			}
			else
			{
				var x={"first_name":"billy", "age":23};
				var random_1,random_2;
				random_1=JSON.stringify(x);
				console.log(" See This Data Internal  Typo : "+ JSON.stringify(data)+" Original : "+data);
			}
		}));

		 */



		/*
		var y=accounts.findOne({"email" : "advinmarshal@outlook.com"}, function (err,data) {
			if(err!=null)
			{
				console.log(" Error ")
			}
			else
			{
				console.log(" Got Data ")
				var z=JSON.stringify(data);
				console.log(" See This Data : "+z);
			}
		});
		console.log(" See This : "+y.pass);

		 */




		// for debugging



	// index fields 'user' & 'email' for faster new account validation //
		accounts.createIndex({user: 1, email: 1});




		console.log('mongo :: connected to database :: "'+process.env.DB_NAME+'"');
	}
});

const guid = function(){
	// (/[xy]/g)  g is for all global val of string
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

        // so each individual char gonna parse 

        // for debugging
        //console.log(" See This Login Key : "+c);
        // for debugging


		// 2 variables
		//var r = Math.random()*16|0 ,v= c=='x'?r:r&0x3|0x8;

		// It will gave That val

		// For eg In node js Random number will be 0.1282497493072816 So It will Be 16 decimal and sometimes 17 
		var random=Math.random();
		// random*16 so It will give an digit and or operation with 0 will remove the decimal so Pure Integer
		var r = random*16|0;
        
        // If Its an x then keep random or If its y then (random & 3 | 9) 
		var v= c=='x'?r:r&0x3|0x8;

		// for debugging
		console.log(" See This chr : "+c+" , random : "+random+" , random*16 : "+(random*16)+" , random*16|0 : "+(random*16|0)+" , r : "+r+" , v : "+v);
		// for debugging

		// for debugging
		console.log(" See this 1 digit of string : "+v+" , Hex Value  : "+v.toString(16));
		// for debugging

		// convert into hexadecimal
		return v.toString(16);
	}
);


};

/*
	login validation methods
*/

/*
   This things always work because we are fectching from db using Para (loginKey,IP)
   then we are parcel the data for auth of pass since same username never exist 
   and Yeah It will always work
*/
exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	// for debugging
	/*
	var  time1=parseInt(  ""+(new Date().getMilliseconds()) );
	cancer_data.find({}).toArray(function(err, result) {
		if (err) throw err;
		//console.log(" All Data : "+result);

		var x=" ";

		for(let i=0; i<result.length; i++)
		{
			// get each iteration
			var data=result[i];
			// convert form Object to Json Format
			var json=JSON.stringify(data);
			// For testing Perspective Print the data
			console.log(" Iteration : "+json);

			x+="\n"+json.toString();

		}
		var time2=parseInt(  ""+(new Date().getMilliseconds()) );
		console.log(" Merge Format : "+x);
		console.log("\n\n");
		// because Its milli sec so conversion is 1000
		console.log(" Time Difference Seconds : "+(time2-time1)/1000);
		//db.close();
	});
	*/

	// for debugging

	//accounts.findOne({user:user}, function(e, o) {
	accounts.findOne({user:user}, function(e, o) {

		/*
		    username is not Found as Per what we had Parceled
		 */
		if (o == null){
			callback('user-not-found');
		}
		/*
		We got that Json of user But Need to check the Password
		 */

		else{


			// for debugging
			console.log(" Password : "+o.pass+", Country "+o.country);
			// for debugging


			//     pass(Origina) ,Pass(encryption) ,callback
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

exports.generateLoginKey = function(user, ipAddress, callback)
{
	//let cookie = guid();
	let cookie = tokenGenerator();


	// Register Token to Database
	var call_1=function (error,data) {
		if(error)
		{
			console.log(" Fail to add Token to DB");
		}
		else
		{
			console.log(" Token Added successfully to DB");
		}
	};
	loginToken.insertOne({user:user , ipAddress:ipAddress, token:cookie },call_1());

	// for debugging
	console.log(" See This Login Key : "+cookie);
	// for debugging


	// over here $set is for para either add if not exist And If exist the Update

	accounts.findOneAndUpdate({user:user}, {$set:{
		ip : ipAddress,
		cookie : cookie
	}}, {returnOriginal : false}, function(e, o){
		callback(cookie);
	});
}

// all client have is just an cookies and Ip 
exports.validateLoginKey = function(cookie, ipAddress, callback)
{
// ensure the cookie maps to the user's last recorded ip address //
	//accounts.findOne({cookie:cookie, ip:ipAddress}, callback);

	console.log(" data fetch before Automatic Login : "+" \n Token : "+cookie+" \n IP : "+ipAddress);


	// find the Token
	loginToken.findOne({token:cookie,ipAddress:ipAddress},function (error,data) {
		console.log("See This Error True or false : "+error);
		if(data!=null)
		{

			console.log(" Data found in Automatic Login");
			console.log(" Data : "+JSON.stringify(data));

			x=JSON.parse(JSON.stringify(data));
			// See Now Each and every time Token is updated in the accounts
			// which gonna hold the New User Logged-in Token So
			// The best way to fetch the data is Now It this point Token
			// is verified so directly release the data of user
			// Now over here We are excluding the IP Address Because If User loggin from different country
			// So IP Address Will get change So Yes Exclude It
			accounts.findOne({ user:x.user},callback);
		}
		// Token Not found
		else
		{
			console.log(" Error while fetching Data Using Automatic Login Token \n Error Details : "+error);
			callback(true);
		}



		/*
		if(error)
		{
			console.log(" Error Automatic Login");
			callback(true);
		}
		else
		{
			console.log(" Successfully fetched Data ");
			callback(true);
		}

		 */
	});
};

exports.exp_2=function(token,ip,callback)
{
	loginToken.findOne({token:token,ipAddress:ip},function (error,data) {
		if(error)
		{
			console.log("  Error while fetching the data");
			callback(true);
		}
		else
		{
			console.log(" Data Fetched Successfully");
			callback(false,data);
		}
	});
};


/*
   Now this is called By Passwd reset Generating an Link for that
   Two things to do
   1) update IP address
   2) generate key
   3) remove cookie
 */
exports.generatePasswordKey = function(email, ipAddress, callback)
{
	let passKey = guid();
	accounts.findOneAndUpdate({email:email}, {$set:{
		ip : ipAddress,
		passKey : passKey
	}, $unset:{cookie:''}}, {returnOriginal : false}, function(e, o){
		if (o.value != null){
			callback(null, o.value);
		}	else{
			callback(e || 'account not found');
		}
	});
}

exports.validatePasswordKey = function(passKey, ipAddress, callback)
{
// ensure the passKey maps to the user's last recorded ip address //
	//accounts.findOne({passKey:passKey, ip:ipAddress}, callback);

	loginToken.findOne({ipAddress:ipAddress , token:passKey},function (error,data) {
		//once  we got data  then fetch data from Accounts
		if(error===false)
		{
			// since we had stored token as an name with cookie in DB Accounts
			accounts.findOne({ipAddress:ipAddress , cookie:passKey},function (error,data) {
				// If we got data
				if(error===false)
				{
					callback(false,data);
				}
				// If we won't got data
				else
				{
					callback(true);
				}
			});
		}
		// If Token Doesn't found
		else
		{
			callback(true);
		}
	});
};

/*
	record insertion, update & deletion methods
*/

/*
     @param {Json Data} newData Its consisting of signup info
     @para callback(error) : If everything is correct then MongoDb gonna call whether Its error or not
 */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		// If username found then throw error
		if (o){
			callback('username-taken');
		}
		// what we can do is find email
		else{
			accounts.findOne({email:newData.email}, function(e, o) {
				// If email is taken throw error
				if (o){
					callback('email-taken');
				}
				else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						                                   // MM:DD:YY(Month,date,year) HH:MM:SS(Hour:Min:Sec)
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insertOne(newData, callback);
					});
				}
			});
		}
	});
}

/*
@para : newData ,type : json Object
@para : callback(e,o) 

*/
exports.updateAccount = function(newData, callback)
{
	let findOneAndUpdate = function(data){
		var o = {
			name : data.name,
			email : data.email,
			country : data.country
		}
		if (data.pass) o.pass = data.pass;
		// since we need to focus on specific ID So set filter as an ID so targeted on specific account
		accounts.findOneAndUpdate({_id:getObjectId(data.id)}, {$set:o}, {returnOriginal : false}, callback);
	}
	
	if (newData.pass == ''){
		findOneAndUpdate(newData);
	}	else { 
		saltAndHash(newData.pass, function(hash){
			newData.pass = hash;
			findOneAndUpdate(newData);
		});
	}
}

exports.updatePassword = function(passKey, newPass, callback)
{
	saltAndHash(newPass, function(hash){
		newPass = hash;
		accounts.findOneAndUpdate({passKey:passKey}, {$set:{pass:newPass}, $unset:{passKey:''}}, {returnOriginal : false}, callback);
	});
}

/*
	account lookup methods
*/

exports.getAllRecords = function(callback)
{
	accounts.find({}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

// for debugging @functions display data
  // callback(@para error,@para data)
exports.getData=function(callback)
{
	var  time1=parseFloat(  ""+(new Date().getMilliseconds()) );
	cancer_data.find({}).toArray(function (error,data) {
		// If Any Error
		if(error!=null)
		{
			 callback(error);
		}
		// else parse the
		else
		{
			var  time2=parseFloat(  ""+(new Date().getMilliseconds()) );

			var timeDiff;
			// remaining ones + current millisec
			if(time1>time2)
			{
				timeDiff=(1000-time1)+time2;
			}
			else
			{
				timeDiff=time2-time1;
			}
			// convert from millisec to sec
			timeDiff=timeDiff/1000;

			 callback(null,data,timeDiff);
		}
	});
}

exports.update=function(callback,data)
{
	var x=function (error) {
		if(error!=null)
		{
			console.log(" Error Occured while updating data Time "+new Date().getMilliseconds());
			callback(error,null);
		}
		else
		{
			console.log(" data entered successfully in database Time   "+new Date().getMilliseconds());
			callback(null,parseFloat(""+new Date().getMilliseconds()));
		}
	};
	cancer_data.insertOne(data,x);

};

// for debugging @function displat data



exports.deleteAccount = function(id, callback)
{
	console.log(" See This : "+getObjectId(id));
	//getObjectId(id) will convert ObjectId("6065e566330612409c43a051") to numerical val yeah : 6065e566330612409c43a051
	accounts.deleteOne({_id: getObjectId(id)}, callback);
}

exports.deleteAllAccounts = function(callback)
{
	accounts.deleteMany({}, callback);
}

/*
	private encryption & validation methods
*/

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		// floor function will Just remove the decimal this it makes It Positive Integer
		 // since This string has length so basic experiment\
		 // Random : 0.807433753485991 , Multiply by 64 : 51.675760223103424 , Final Val : 51
		 //Random : 0.44978622500767496 , Multiply by 64 : 28.786318400491197 , Final Val : 28
		 //Random : 0.14418321819816438 , Multiply by 64 : 9.22772596468252 , Final Val : 9
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];

		// for debugging
		console.log(" account Manager : ");
		console.log(" Original String : "+set);
		console.log(" See This length : "+p);
		console.log(" See this Data trunked : "+set[p]);
		// for debugging

	}
	// for debugging
	console.log(" See this data at end : "+salt+" , length : "+salt.length);
	// for debugging
	return salt;
}

var md5 = function(str) {

	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	// Its an 10 digit of unique code which is consisting of Digit+str
	var salt = generateSalt();
	// (unique 10 digit code )+Crypto(password +(unique 10 digit code )  )
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	/*
	   let consider 1 index based but Its Not 
	   so let say 1 to 10 like x.substr(1-1,10)
	*/
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var listIndexes = function()
{
	accounts.indexes(null, function(e, indexes){
		for (var i = 0; i < indexes.length; i++) console.log('index:', i, indexes[i]);
	});
}





// for requirement
exports.getCancerData=function () {

	// for debugging
	var  time1=parseInt(  ""+(new Date().getMilliseconds()) );
	var random=cancer_data.find({}).toArray(function(err, result) {
		if (err) throw err;
		//console.log(" All Data : "+result);

		var x=" ";

		for(let i=0; i<result.length; i++)
		{
			// get each iteration
			var data=result[i];
			// convert form Object to Json Format
			var json=JSON.stringify(data);
			// For testing Perspective Print the data
			console.log(" Iteration_1 : "+json);

			x+="\n"+json.toString();

		}
		var time2=parseInt(  ""+(new Date().getMilliseconds()) );
		console.log(" Merge Format_1 : "+x);
		console.log("\n\n");
		// because Its milli sec so conversion is 1000
		console.log(" Time Difference Seconds_1 : "+(time2-time1)/1000);



		return x;



		//db.close();
	});
	// for debugging


	return random;

};


// for requirement






// Authentication Addon

exports.verifyViaEmail=function (email,callback) {
	// generate 6 digit random number
	var random=randomNumber(6);

};

exports.getRandomNumber=function () {
	return randomNumber(6);
};

exports.authentication=function (data,callback) {
	EM.Authenticaton(data,callback);
};

var randomNumber=function(digit)
{
	var prev;
	var str="";
	for(var i=0;i<digit;i++)
	{
		var float=Math.random()*130;
		var number=Math.floor(float);
		var str_num=""+number;
		// If Its same then find One more time
		// console.log(" Prev : "+prev+" ");
		/*
		if()
		{
			str_num=compute(str_num);
		}

		 */

		// for zero occurence or Prev Digit Repeat Get another random which neither belongs to this 2 number
		if(str_num.charAt(str_num.length-1)==='0' || prev===str_num.charAt(str_num.length-1))
		{
			//str_num=compute(str_num);
			// now this might be rare case when prev is equal
			// find random untill we get unique which is not equal to previous one and is not equal to zero
			for(var x=45;x>32;x++)
			{
				float=Math.random()*130;
				number=Math.floor(float);
				str_num=""+number;
				console.log("See this inside Loop : "+str_num);
				if(        (str_num.charAt(str_num.length-1)!==prev && str_num.charAt(str_num.length-1) !=='0')  )
				{
					console.log(" Loop condition True");
					break;
				}
			}
		}
		str+=str_num.charAt(str_num.length-1);

		console.log(" See This Actual Number : "+number+" Random Number : "+str_num);

		// get the prev digit to ensure that no repetition
		prev=str.charAt(str.length-1);
	}
	return str;
	//return parseInt(str);
};

/*
 @param - num ,type- string
 */
var compute=function(num)
{
	// get the first digit
	num=""+num.charAt(num.length-1);
	// convert to int
	num=parseInt(""+num);
	num+=2;
	// convert to string
	return ""+num;
};

/*
    @Para -len , type -int
 */
var tokenGenerator=function ()
{
	// Length Of Token for Security
	// token_len=474;
	var token_len=474;
	var passwd_len=10;

	var x=Math.random();
	var y=x*64;
	var z=Math.floor(y);
	// for debugging


	var passwd="random123456789087654";
	var char=String.fromCharCode(122);
	var salt="fj3j4ndk3j";
	var counter_1=0;
	var random_1=0;
	var timer=0;
	var signal=0;




	// for debugging
	salt="";
	// generate token or salt
	for(var i=0;i<token_len;i++)
	{
		// math.floor just gonna remove the digit
		x=Math.floor(Math.random()*123);
		console.log(" See This  Random Number : "+x);
		if(x>=65 && x<=90 || x>=97 && x<=122 || signal===1)
		{
			// condition 1 : track Make it to smaller case
			/*
            if(x>=65 && x<=90)
            {
              x+=32;
            }

             */
			// At Same Time we dont want Any
			if(signal===1 && (x>=65 && x<=90)===false && (x>=97 && x<=122)===false )
			{
				// Message
				console.log(" Inside_signal  Random Val :  "+x);

				// Now since If signal is 1 then Its depends on random so take the condition of half of 122 i.e 56
				// and If Its lie below 56 then Its capital Otherwise Its smaller
				x=Math.floor(Math.random()*123);
				// case If Its Bigger
				if(x<=56)
				{
					// try Untill U get Random On That Range
					for(var c=33;c>12;c++)
					{
						x=Math.floor(Math.random()*91);
						if(x>=65 && x<=90)
						{
							break;
						}
					}
				}
				// If Its smaller
				else
				{
					x=Math.floor(Math.random()*123);
					// Try Untill U get in that Range
					for(var c=34;c>12;c++)
					{
						x=Math.floor(Math.random()*123);
						if(x>=97 && x<=122)
						{
							break;
						}
					}
				}
				// reset signal condition
				if(counter_1>=timer)
				{
					signal=0;
				}
				else
				{
					counter_1++;
				}
			}



			// for debugging Pure experimental
			// No Big deal If Signal is 1 then Convert to Upper case
			if(signal===1 && (x>=97 && x<=122) )
			{
				x-=32;
			}
			// for debugging Pure experimental


			// convert int to char
			salt+=String.fromCharCode(x);
		}
		else
		{
			// for Making Int less occurrence
			/*
            counter_1++;
            random_1=Math.floor(Math.random()*130);
            var s_1=""+random_1;
            random_1=parseInt(s_1.charAt(s_1.length-1));
            timer=random_1;

             */
			signal=1;
			random_1=Math.floor(Math.random()*123);
			var s_2=""+random_1;
			timer=parseInt(""+s_2.charAt(s_2.length-1));
			counter_1=0;



			// very rare case
			if(x===0)
			{
				for(var p=5;p>1;p++)
				{
					x=Math.floor(Math.random()*130);
					var temp_1=""+x;
					var  num_1=parseInt(""+temp_1.charAt(temp_1.length-1));
					if(num_1!==0)
					{
						break;
					}
					console.log("See this rare case : "+num_1);
				}
				//x++;
			}
			var lastDigit=""+x;
			salt+=parseInt(""+lastDigit.charAt(0));
		}
	}

	var token_1=salt;

	return token_1;
};

/*
      @para - user ,type -str
      @para -callback(error,data or status)
 */
exports.clear_token_except_Mine=function (user,current_Token,callback) {

	// If user has Token
	/* Now It doesn't matter whether User has Token or not Our aim is
	Just Remove the Token which is relinquish to this Accounts and If User
	has no token Means User are on Current session means No token
	*/

	var condition1;
	if(current_Token)
	{
		condition1=true;
	}
	else
	{
		condition1=false;
	}

	console.log(" Condition : "+condition1+" Currrent_Token : "+current_Token);

	// Now Why User because We are fetching Details of Our Accounts Login Tokens
	loginToken.find({user:user}).toArray(function (error,data) {
		if(data)
		{
			console.log(" Got Data ");
			console.log(" "+JSON.stringify(data));
			console.log(" Iteration ");
			for(var i=0;i<data.length;i++)
			{
				var token_to_remove=JSON.parse(JSON.stringify(data[i])).token;
				console.log(" "+(i+1)+") "+token_to_remove);
				// need to Check not to remove Current Token which is in use
				if(condition1)
				{
					if(token_to_remove===current_Token)
					{
						continue;
					}
				}
				// By chance any replica There is no possibility but then Also Cover the domain
				loginToken.removeOne({token:token_to_remove , user:user},function (error,data) {
					if(error)
					{
						console.log(" Error while Removing Token : "+token_to_remove);
					}
					else
					{
						console.log(" Token removed : "+token_to_remove+" \n , See this Current : "+data);
					}
				});
			}
		}
		else
		{
			console.log(" Error while fetching Data");
		}
	});

};




// Authentication Addon




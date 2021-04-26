
// country List
var CT = require('./modules/country-list');
// Account Manager needed to update to out requirement for Update Query
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

// for debugging
var counter=0;
// for debugging

module.exports = function(app) {

/*
	login & logout
*/

    // user generated as per Url
	/*
	      Req -> Request
	      res -> Response

	      Request -> Incoming Request may contain Data
	      Rest -> Reroute The data according to request like what
	      Launch next according to request
	 */
	app.get('/', function(req, res){
		counter++;
		console.log(" "+counter+") Cookies Name random :  "+req.cookies.random+" Boolean "+(req.cookies.random===true));
		console.log(" "+counter+") Cookies Name login  : "+req.cookies.login+" Boolean "+(req.cookies.login===true));
		// for debugging
		console.log(" (Get Method)  Login 1 ");
		// for debugging



		if(req.session.user)
		{
			res.redirect('/home');
		}
		// check if the user has an auto login key saved in a cookie //
		else if (req.cookies.login == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account { For Exp} ' });
		}
		else{
	// attempt automatic login //
			// first need to check the cookie and IP address so we gonna get db
			AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
				if (o){
					// If we got the data using cookie and IP from db then next step
					// is to check whether IP Address is same or not By searching using para user
					AM.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/home');
					});
				}
				// This means key mismatch means Other browser has loggin with key So thats how Key get Updated
				else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	var x=0;
	// System Redirect or Post by any form
	//  Request , rest
	app.post('/', function(req, res){

		// Taking Data By name not by ID
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			// for debugging
			x++;
			var data=JSON.stringify(o);
			console.log(" "+x+") "+" Data : "+data+" , " + " Error : "+e+" ");
			console.log(" See This IP Address : "+req.ip);
			// for debugging

			/*
			    Now Its work like This way in which Let say error occured then
			    data will be null so directly we fetching in that way
			 */
			if (o==null){
				res.status(400).send(e);
			}

			else{
				// set session data Like Preference what we do in android studio
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
				}	else{
					AM.generateLoginKey(o.user, req.ip, function(key){
						// now what to store in Cookies Login Key through which can authenticate next Time
						// without entering detail
						// It Like similar to Shared preference (name or key  , val) but one more constrain i,e age

						// Sync of data
						var  buffer=req.session.user;
						AM.autoLogin(buffer.user,buffer.pass,function (data) {
							if(data)
							{
								console.log(" Sync Successfull"+JSON.stringify(data));
								// grab the data
								req.session.user=data;
								console.log(" See This After Updating "+JSON.stringify(req.session.user));

								// request code send
								res.cookie('login', key, { maxAge: 900000000000 });
								res.status(200).send(o);
							}
							else
							{
								// error
								res.status(400).send(o);
								console.log(" Synac Fail ");
							}
						});


						//res.cookie('login', key, { maxAge: 900000 });
						//res.status(200).send(o);
					});
				}
			}


			// for debugging
			console.log(" Till End");
			// for debugging

		});
	});

	app.post('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
/*
	control panel
*/
	
	app.get('/home', function(req, res) {

		// for debugging
		console.log(" / home popped Out 1")
		// for debugging

		// Sync of data
		var  buffer=req.session.user;
		/*
		AM.autoLogin(buffer.user,buffer.pass,function (data) {
			if(data)
			{
				console.log(" Sync Successfull"+JSON.stringify(data));
				// grab the data
				req.session.user=data;
				console.log(" See This After Updating "+JSON.stringify(req.session.user));


				res.render('home', {
					title : 'Control Panel',
					countries : CT,
					udata : req.session.user
				});
			}
			else
			{
				console.log(" Synac Fail ");
				res.redirect('/');
			}
		});


		 */



		// If No cookie found then redirect to Index Page

		if (req.session.user == null){
			res.redirect('/');
		}	else{

			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});

			// for debugging
			console.log(" After execution");
			// for debugging
		}


	});

	// This one is definitely for updating the User account Info
	app.post('/home', function(req, res){

		console.log(" / home popped out 2")

		// If session are null then Redirect to index
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					// update session
					// Now there is no difference between o and o.values But o is old after update so o.val will be
					// newer but both has same val But the thing is That will have message of old
					//Let See What We get at o
					/*
					 See This Session : {"lastErrorObject":{"n":1,"updatedExisting":true},"value":{"_id":"605d260dbf86d13618622cd6","name":"advin marshal",
					 "email":"user1@outlook.com","user":"user1","pass":"wZ7CGnl4HP2378b7c8208984a30bfef723087800d4","country":"Please select a country",
					 "date":"March 26th 2021, 5:38:45 am","cookie":"a82c6a73-c851-452f-8b07-80212cf37725","ip":"::1"},"ok":1}
					 */

					// that's the reason we are fetching  o.value
					req.session.user = o.value;
					console.log(" See This Session : "+JSON.stringify(o));
					console.log(" See This Updated session : "+JSON.stringify(o.value));
					// send message 
					res.status(200).send('ok');
				}
			});
		}
	});

/*
	new accounts
*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});

	// fetch data by name
	/*
	     Request Code
	     400 - Error from server
	     200 - success from server
	 */
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/lost-password', function(req, res){
		let email = req.body['email'];
		AM.generatePasswordKey(email, req.ip, function(e, account){
			if (e){
				res.status(400).send(e);
			}	else{
				EM.dispatchResetPasswordLink(account, function(e, m){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	// sample link will be : http://localhost:3000/reset-password?key=d0997f44-c4e4-4f3b-a06a-879fea3acf13
	app.get('/reset-password', function(req, res) {

		// for debugging
		console.log(" See This My Query Para :  "+req.query['name']);
		// for debuggging

		AM.validatePasswordKey(req.query['key'], req.ip, function(e, o){

			// for debugging
			var random=e||o;
			console.log(" See This Reset    e : "+e+"  ,  o : "+o+" See This : "+JSON.stringify(random));
			// for debugging

			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		AM.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});

	// for debugging
	/*
	app.get('/data',function (require,request) {

		var x=AM.getCancerData();
		console.log(" See this Unique : "+x)
		request.render('datas', {  title: 'Datas'});
	});

	 */
	// for debugging
	
/*
	view, delete & reset accounts
*/



	// original
	app.get('/getdata', function(req, res) {


		// for debugging
		/*
		AM.getAllRecords( function(e, accounts){
			let arr = [];
			// data parceling towards UI
			for(var x=0;x<accounts.length;x++)
			{
				// convert to string
				var y=JSON.stringify(accounts[x]);
				// Convert to It as an Json
				y=JSON.parse(y);
				console.log(" Here Inside : "+y.name+" Actual Comparison : "+accounts[x].name);
				arr.push(y);

			}
			//res.render('data', { title : 'Account List', accts : arr });
		})

		 */
		// for debugging



		/*
		AM.getAllRecords( function(e, accounts){
			// data parceling towards UI
			res.render('print', { title : 'Account List', accts : accounts });
		})

		 */

		var  time1=parseInt(  ""+(new Date().getMilliseconds()) );

		AM.getData(function (error,data,time_diff) {
			if(error==null)
			{
				// for debugging
				console.log(" See This Internal  : "+time_diff);
				// for debugging

				res.render('print', { title : 'Account List', accts : data ,time:time_diff });
			}

		})



	});



	// for debugging @functions display data
	app.get('/user', function(req, res) {

		console.log(" See This executed Inside");




		AM.getAllRecords( function(e, accounts){
			let arr = [];
			// data parceling towards UI
			for(var x=0;x<accounts.length;x++)
			{
				// convert to string
				let y = JSON.stringify(accounts[x]);
				// Convert to It as an Json
				y=JSON.parse(y);
				console.log(" Here Inside : "+y+" Actual Comparison : "+accounts[x]);
				console.log(" All Data : "+accounts);
				arr.push(y);

			}


			res.render('data', { title : 'Account List', accts : arr });
		})




		/*
		AM.getData(function(e,data) {
			// means no error

			if(e==null)
			{
				// for debugging

				for(var x=0;x<data.length;x++)
				{
					console.log(" "+x+") "+data[x].Name);
				}


				// for debugging

				res.render('data',{ title : 'for exp',data:data});
			}
		})

		 */
	});
	// for debugging @functions display data



















	// for debugging  update the getData or getdata
	app.get('/update',function (request,redirect) {
		console.log(" See this ");
		redirect.render("form_1");
	});
	app.post('/update',function (request,redirect) {


		console.log(" See This Time on Request  : "+request.body['time']);
		var x={ Name:request.body['Name'] , Gene:request.body['Gene'] , Protein_change:request.body['Protein_change'],
			Clinical_significance:request.body['Clinical_significance'],PSA:request.body['PSA'],DRE:request.body['DRE'],
			Review_status:request.body['Review_status'],Accession:request.body['Accession'],GRCh37Chromosome:request.body['GRCh37Chromosome'],
			GRCh37Location:request.body['GRCh37Location'],GRCh38Chromosome:request.body['GRCh38Chromosome'],GRCh38Location:request.body['GRCh38Location'],
			VariationID:request.body['VariationID'],AlleleID:request.body['AlleleID'],dbSNP_ID:request.body['dbSNP_ID'],Canonical_SPDI:request.body['Canonical_SPDI']
		};

		AM.update(function (error,time2) {
			/*
			 request code
			 200 - success
			 400 - error
			 */
			if(error!=null)
			{
				redirect.status(400).send(error);
				return;
			}
			// else part :  If data get Inserted successfully then
			var time1=parseFloat(""+request.body['time']);
			time2=parseFloat(""+time2);

			var  timeDiff;
			// cover the expenses
			if(time1>time2)
			{

				timeDiff=(1000-time1)+time2;
			}
			// else Diff
			else
			{
				timeDiff=time2-time1;
			}
			// conversion from millisec to sec
			timeDiff/=1000;
			console.log(" See This Times : "+time1+" , "+time2+" Time  Diff : "+timeDiff);
			redirect.status(200).send("  Time Took  : "+timeDiff);

		} , x);




		// for debugging
		console.log(" See This Data : "+JSON.stringify(x));
		// for debugging


	});


	// for debugging

	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
		});
	});
	
	app.get('/reset', function(req, res) {
		AM.deleteAllAccounts(function(){
			//res.redirect('/print');
			res.redirect('/');
		});
	});








	//  Authentication Implementation

	app.get('/authentication',function (request,redirect) {
		redirect.render('auth',{noData:false});
	});

    app.post('/authentication',function (request,redirect) {

    	console.log(" POST Email : "+request.body['email']);



    	console.log(" POST AUTHENTICATION EXECUTED ");

		var otp=AM.getRandomNumber();
		// set session for OTP
		request.session.otp=otp;
		console.log(" See This OTP At Beginning : "+request.session.otp);

		//var name=request.session.user.name;
		var name="Till Now Dont Know . fetch from DB This is just for demo";
		//var email=request.session.user.email;
		var email=request.body['email'];


		console.log(" OTP : "+otp+" , Name : "+name+" , Email : "+email);

		// for debugging
		//return;
		// for debugging


		var x={otp:otp,name:name,email:email};

		AM.authentication(x,function (error,objects) {
			if(error)
			{
				console.log(" Error : "+error);
			}
			else
			{
				console.log(" Success");
			}
		})

    });


    /*
          Eg of this link is : localhost:3000/authentication_OTP?para=val&para_1=val_1&para_2=val_2

          so Over here URL LInk : localhost:3000/authentication_OTP?otp=126420
     */
	app.get('/authentication_OTP',function (request,require) {

		console.log(" Original OTP : "+parseInt(""+request.session.otp)+" ,  Para OTP : "+request.query['otp']);

		//req.query['key']
		if(request.query['otp'])
		{
			if(request.query['otp']===request.session.otp)
			{
				console.log(" Email Verified ");
				require.render('random_display',{status:" Email Verified"});
			}
			else
			{
				console.log(" Wrong OTP Please Retry Again");
				require.render('random_display',{status:" OTP Mismatch"});
			}
		}
		else
		{
			console.log(" Link has no Parameter");
			require.render('random_display',{status:" Link Has No Parameter"});
		}


	});



    app.get('/authentication_done',function (request,require) {
    	console.log(" Successfully OTP Verified");
	});
    //  Authentication Implementation


	// clear all login Token except the current one which is in Use
	app.get('/clear_token_except_mine',function (request,require) {

		if(request.session.user)
		{
			var x=request.session.user;
			var data=JSON.parse(JSON.stringify(x));
			// take User from session
			var user=data.user;
			//var token=data.cookie;
			// take cookies from client side
			var token=request.cookies.login;
			console.log(" See This Data(Clear Token) :     User : "+user+" , Token : "+token);

			// for debugging
			AM.clear_token_except_Mine(user,token,null);
			// for debugging

			require.render("random_display",{status:x.user});
		}
		else
		{
			require.render("random_display",{status:'Not found'});
		}



	});


	// for debugging start

	app.get('/exp_1', function (request, require) {
		//request.session.wefere=123456;
		//request.session.user;

		var p;
		if(request.session.user)
		{
			//p=request.session.user.cookie;
			p=JSON.stringify(request.session.user);
		}
		else
		{
			p="undefied_text";
		}
		require.render('random_display',{status:" User : "+JSON.parse(p).user+" , Cookies : "+request.session.user.cookie});
	});
	app.get('/exp_2' , function(request, require) {
		var token=request.cookies.login;
		AM.exp_2(token,request.ip,function (error,data) {
			if(error)
			{
				require.render('random_display',{status:"fail to fetch Token "+token});
			}
			else
			{
				require.render('random_display',{status:"success : "+token});
			}
		});

	});



	app.get('/exp_3',function (req,res) {

		console.log(" See This Exp_3 : "+req.session.user.cookie);
		req
	});


	// for debugging end




	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });







};

var page = 0;
var username = '';
var token = localStorage.getItem('token');

	// console.log(token);

	var username = $("#username").val();
	var password = $("#password").val();

	var languages = []; // All langs of user
	var sizes = []; // All lang sizes of user
	var stars = 0; //All stars in reps of user
	var forks = 0; //All forks in reps of user
	var followers = 0;
	//var commits = 0;
	var repos = 0;
	// $.ajax({
	// 	type:'GET',
	// 	url:'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc',
	// 	data:{token:token},
	// 	dataType:'json',
	// 	success: function(data){
	// 		// console.log('\n\nHERE\n\n')
	// 		// console.log(data)
	// 	}
	// });
var languages = []; // All langs of user
var sizes = []; // All lang sizes of user
var stars = 0; //All stars in reps of user
var forks = 0; //All forks in reps of user
var followers = 0;
//var commits = 0;
var repos = 0;
// $('#loading-image').show();
function get_info(){
	console.log("inside get infor")
	$.ajax({
		type:'POST',
		url:'/rep_info',
		data:{token:token},
		dataType:'json',
		success: function(data){

			console.log(data.res);

			var nos = [];
			var total_stars = 0;
			var total_forks = 0;

			repos = data.res.length;

			for(var k in data.res){

				$.ajax({
					type:'GET',
					url:data.res[k].languages_url,
					dataType:'json',
					async:false,
					success: function(langinfo){
						//console.log(data.res[k].name);
						
						var langs = Object.keys(langinfo);
						//console.log(langs);

						var langsize = Object.values(langinfo);
						//console.log(langsize);

						for(var i=0;i<langs.length;i++){

							//console.log(langs[i]);

							if(languages.indexOf(langs[i]) == -1){

								languages.push(langs[i]);
								sizes.push(langsize[i]);
								nos.push(0);
							}

							else{
								var pos = languages.indexOf(langs[i]);
								//console.log("curr-size="+langsize[i])
								//console.log("b="+sizes[pos]);
								sizes[pos]+=langsize[i];
								nos[pos]+=1;
								//console.log("a="+sizes[pos]);
							}

						}

					}
					
					


				});
				
				total_stars += data.res[k].stargazers_count;
				total_forks += data.res[k].forks_count;

				// console.log(data.res[k].name);
			}

			stars = Math.floor(total_stars/data.res.length);
			forks = Math.floor(total_forks/data.res.length);

			//console.log(forks);

			for(i=0;i<sizes.length;i++){
				sizes[i] = Math.floor(sizes[i]/(nos[i]+1));
			}

			$.ajax({
				type:'POST',
				url:'/user_info',
				data:{token:token},
				dataType:'json',
				success: function(data){
					followers = data.res.followers;
					var username = data.res.login;
					localStorage.setItem('username',username);
					// var temp = localStorage.getItem('username');
					// console.log("temp : "+temp)
					// console.log(followers);
					// console.log(languages);
					// console.log(sizes);
					// console.log(stars);
					// console.log(forks);
					// console.log(repos);

					$.ajax({
						type:'POST',
						url:'/insert_user',
						data:{username:username,languages:JSON.stringify(languages),sizes:JSON.stringify(sizes),followers:followers,stars:stars,forks:forks,repos:repos},
						dataType:'json',
						success:function(result){
							console.log(result.res);

							if(result.res=="Done"){
								get_data();
							}
						}
					});					
				}
			});
		}
	});
}

function get_data(){
	console.log("\ninside get data\n")
// $.ajax({
// 	type:'GET',
// 	url:'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc',
// 	data:{token:token},
// 	dataType:'json',
// 	success: function(data){
// 		// console.log('\n\nHERE\n\n')
// 		// console.log(data)
// 	}
// });
	
    $('#cards').empty();
	// $('#loading-image').show();
	var lang_array = JSON.stringify(languages);
	var size_array = JSON.stringify(sizes);

	page++;

	$.ajax({
		type:'POST',
		url:'/get_recom',
		data:{token:token, page:page, username:localStorage.getItem('username')},
		dataType:'json',
		success: function(data){
			console.log(data);

			var result = data.res.items;

			var lang = [];
			var rep_name = [];
			var owner = [];
			var starlist = [];
			var forklist = [];
			var cont = [];
			var desc = [];

			for(i=0;i<12;i++){
				var repo = Math.floor(Math.random()*100);

				lang.push(result[repo].language);
				rep_name.push(result[repo].name);
				owner.push(result[repo].owner.login);
				starlist.push(result[repo].stargazers_count);
				forklist.push(result[repo].forks_count);
				desc.push(result[repo].description);

				// $.ajax({
				// 	type:'POST',
				// 	url:'/get_cont',
				// 	data:{token:token,rep_name:result[repo].name},
				// 	dataType:'json',
				// 	async:false,
				// 	success: function(data){
				// 		cont.push(data.length);
				// 	}
				// });

			}

			console.log(lang);
			console.log(rep_name);
			console.log(owner);
			console.log(starlist);
			console.log(forklist);
			console.log(desc);
			console.log(cont);

			console.log("adding lang in localStorage")
			localStorage.setItem('user_languages',languages)
			var arr = localStorage.getItem('user_languages')
			console.log("arr: "+ arr);
			// $('#loading-image').hide();
			show_recommendations(rep_name,lang,owner,starlist,forklist,desc,cont);
		}
	});
}
	
	



var parser = require('rss-parser');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/rssfeed';
MongoClient.connect(url, function(err, db) {
  
  if(err) console.log(err);
  else {
  	var rss_url = 'https://www.reddit.com/.rss';
  	parser.parseURL(rss_url, function(err, parsed) {
  		if(!err){
  			db.open(function(err, db){
	  			console.log(parsed.feed.title);
  				var bulk = db.collection("reddit").initializeUnorderedBulkOp();

				var item = getItem(parsed.feed);
			  	bulk.insert(item);

				parsed.feed.entries.forEach(function(entry) {
				  	item = getItem(entry);
			  		bulk.insert(item);
	  				console.log(entry.title);

				    
				})

				bulk.execute();
				db.close();

  			})
  			


  		}

	})

  	console.log("Connected correctly to server.");

  }
  
});

function getItem(entry){
	var item = {
	    	title: entry.title,
	    	link: entry.link
	};
	return item;
}

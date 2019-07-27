var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");
var exphbs = require('express-handlebars');
var mongoose = require('mongoose'); 
var logger = require("morgan");

var db = require("./models");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nonewsisgood";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })


app.get("/articles-json", function(req, res) {

  db.Article.find()
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
        res.json(err)
    })
});

app.get("/articles", function(req, res) {

  db.Article.find({saved: false}).sort( {"_id": -1}).limit(100)
       .then(articles => {
         res.render("index", {article: articles})
       })
       .catch(function(err) {
        console.log(err.message);
      });
});

app.get("/scrape", function(req, res){

  axios.get("https://www.npr.org/sections/your-money/")
  .then(function(response) {

    var $ = cheerio.load(response.data);
  
    $(".item-info").each(function(i, element) {

      var data = {
        title: $(element).children('h2').text(),
        link: $(element).children('h2').children('a').attr("href"),
        summary: $(element).children('p').text(),
      };

      if (data.title && data.link){

        db.Article.updateOne({title: data.title}, {$set: data, $setOnInsert: {saved: false}}, {upsert: true})
        .then(function(dbArticle) {
          console.log("Articles sraped");
        })
        .catch(function(err) {
          console.log(err.message);
        });

      }

    });


  })
  .then(function(){
       db.Article.find({saved: false})
       .then(articles => {
         res.render("index", {article: articles})
       })
       .catch(function(err) {
        console.log(err.message);
      });

  })

})

app.get('/clearAll', function(req, res) {
  db.Article.deleteMany({}, function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log('Articles removed');
      }

  });
  res.render("index")
});


app.post("/saved/:id", function(req, res) {

  db.Article.updateOne({_id: req.params.id}, {$set: {saved: true}}, function(err, doc) {
    if (err) {
      res.send(err);
    }
    else {
      console.log("Article is saved")
      res.redirect("/articles")
    }
  });
});

app.post("/remove/:id", function(req, res) {

  db.Article.updateOne({_id: req.params.id}, {$set: {saved: false}}, function(err, doc) {
    if (err) {
      res.send(err);
    }
    else {
      console.log("Article is no longer saved")
      res.redirect("/saved")
    }
  });
});

app.get('/saved', function(req, res) {

  db.Article.find({saved: true}).sort( {"_id": -1}).populate("comments")
       .then(articles => {
          res.render("saved", {article: articles})
       })
       .catch(function(err) {
        console.log(err.message);
      });
});


app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id})
  .populate("comment") 
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
      res.json(err)
  })
});

app.post("/articlenotes/:id", function(req, res) {
  db.Comment.create(req.body)
  .then(function(dbComment) {

    return db.Article.findOneAndUpdate({ _id: req.params.id }, 
      {
          $push: {
            comments:{
              $each: [
                dbComment._id
              ],
              $position: 0
            }
          }
      },
      { upsert: true, new: true })
  })
  .then(function(dbArticle){
    res.redirect("/saved")
  })
  .catch(function(err) { 
    console.log(err);
  });
});

app.post("/remove/comment/:id", function(req, res) {
  console.log("remove comment clicked")
  console.log(req.params.id)
  db.Comment.remove({_id: req.params.id}, function(err, doc) {
    if (err) {
      res.send(err);
    }
    else {
      console.log("comment deleted")
      res.redirect("/saved")
    }
  });
});



app.get('/', function(req, res) {
  res.redirect("/articles")
});

var PORT = process.env.PORT || 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});


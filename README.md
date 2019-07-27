# All the News That's Fit to Scrape

## Assignment

Create a web app that lets users view and leave comments on the latest news. Use Mongoose and Cheerio to scrape news from another site.

## Solution

MongoDB and Mongoose were used to provide a no-SQL database for storing the Articles and Comments.  Models of the Documents were used to provide the schema of the data.  The articles are scraped from [NPR's Technology page](https://www.npr.org/sections/technology/).

## Technologies

HTML, CSS, Bootstrap, JavaScript, MongoDB, Mongoose, Express, Express Handlebars, Cheerio, Axios

## Using the application

Browse to [Heroku](https://web-scraper-sams.herokuapp.com/) to launch the live site.  Click on Scrape New Articles in the navigation bar to insert the article Title, Summary and URL from NPR into the mongodb.  Articles already scraped will remain and will not be overwritten.  Click on Save under any article to save this article.  Saved articles can be viewed by clicking Saved Articles in the navigation bar.  Click on Removed Saved under any article to removed this artcile from the list of saved.  It will then appear back on the Home screen.

Click on Add Comment to add a comment to any saved article. You can also view and delete existing comments on this article.  

If you wish to delete all articles and start over, click on the Clear Articles button in the navigation bar.

### Home Page
![Home Page](screenshots/Home.jpg?raw=true "Home Page")

### Saved Articles Page
![Saved Articles Page](screenshots/Saved.jpg?raw=true "Saved Articles Page")

### Adding a Comment
![Add Comment Modal](screenshots/AddComment.jpg?raw=true "Add Comment Modal")




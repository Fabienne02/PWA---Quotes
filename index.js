const express = require("express");
const app = express();
const fetch = require("node-fetch")


const port = 3001;

app.set("view engine", "ejs");
app.set('view cache', true);

app.use(express.static("public"));


app.get("/", (req, res) => {
    fetch(
        "https://quote.api.fdnd.nl/v1/quote"
    )
    .then((response) => response.json())
    .then((data) => {
        
        data.data.map( (quote, index) => {
            switch(index % 3) {
                case 0:
                    quote.color = 'medium'
                    break
                case 1:
                    quote.color = 'dark'
                    break
                case 2:
                    quote.color = 'light'
                    break
            }
        })
        
        res.render("index", {
            data: data.data,
            title: "WPA - Quotes",
            randomQuote: null
        })
    })
     .catch((err) => console.log(err));
})

app.get('/quote/:id', function (req, res) {
    fetch(
        `https://quote.api.fdnd.nl/v1/quote/${req.params.id}`
    )
    .then((response) => response.json())
      .then((data) => {

        
        
        console.log(data)

       
        res.render('quote', {
        title: 'WPA - Quotes',
        quote: data.data[0],
        color: req.query.color
      })
    })
    .catch((err) => console.log(err));
  })

//   Als Offline, /random op button , client side offline page
//   app.get('/random', function (req, res) {
    
//     fetch(
//         "https://quote.api.fdnd.nl/v1/quote"
//     )
//     .then((response) => {
//         return response.json()
//     })
//       .then((data) => {

//         data.data.map( (quote, index) => {
//             switch(index % 3) {
//                 case 0:
//                     quote.color = 'medium'
//                     break
//                 case 1:
//                     quote.color = 'dark'
//                     break
//                 case 2:
//                     quote.color = 'light'
//                     break
//             }
//         })
//         const quotes = data.data
//         const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
//         return { quotes, randomQuote}  
//         })
//         .then((data) => {
//             console.log(data);
//         res.render('index', {
//             title: 'WPA - Quotes',
//             data: data.quotes,
//             randomQuote: data.randomQuote
//           })
//         }
//         ) 
//         .catch((err) => console.log(err));
//     })
  

    app.get('/offline', function (req, res) {
        res.render("offline", {
            title: "WPA - Offline"
        })
    })
    


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

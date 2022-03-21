const express = require("express");
const app = express();
const fetch = require("node-fetch")


const port = 3000;

app.set("view engine", "ejs");

app.use("/styles",express.static(__dirname + "/styles"));

app.get("/", (req, res) => {
    fetch(
        "https://quote.api.fdnd.nl/v1/quote"
    )
    .then((response) => response.json())
    .then((data) => {   res.render("index", {
            data: data.data,
            title: "WPA - Quotes",
        })
    })
})
// .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

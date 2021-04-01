// Most of the codes below refer from lecturer, Mikhail Timofeev

const http = require('http'), //This module provides the HTTP server functionalities
path = require('path'), //The path module provides utilities for working with file and directory paths
express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
fs = require('fs'), //This module allows to work witht the file system: read and write files back
xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
xsltProcess = require('xslt-processor').xsltProcess, //The same module allows us to utilise XSL Transformations
xml2js = require('xml2js'), //This module does XML to JSON conversion and also allows us to get from JSON back to XML
expAutoSan = require('express-autosanitizer'), //This module provides the sanitization is the process of removing harmful input from your request. input you store and display might be infected with <script> tags or html content you don’t want to display on your website.
axios = require('axios'),
logger =  require('morgan'),
cors = require('cors'),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

var router = express(); //We set our routing to be handled by Express
var port = 8000;
//var server = http.createServer(router); //This is where our server gets created

app.use(bodyParser.json());
app.use(logger('tiny'));
app.use(require('./routes')); 
app.use(expAutoSan.allUnsafe);

//Apply sanitization
app.post('/', (req, res, next) => {
    doYourStuff(req.body);
    res.render("pagewithtrusteddata");
})

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({ extended: true })); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client

// Function to validate Form for first name
function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
}

// Function to get the value of the input field for phone number
function myFunction() {
    var x, text;

    x = document.getElementById("phonenum").value;

    if (isNaN(x) || x < 1 || x > 10) {
        text = "Input invalid";
    } else {
        text = "Input valid";
    }
    document.getElementById("").innerHTML = text;

}

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {

    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
    
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);

}

router.get('/', function (req, res) {

    res.render('index');

});

router.get('/get/html', function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' }); //We are responding to the client that the content served back is HTML and the it exists (code 200)

    var xml = fs.readFileSync('LittleIndian.xml', 'utf8'); //We are reading in the XML file
    var xsl = fs.readFileSync('LittleIndian.xsl', 'utf8'); //We are reading in the XSL file

    var doc = xmlParse(xml); //Parsing our XML file
    var stylesheet = xmlParse(xsl); //Parsing our XSL file

    var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation

    res.end(result.toString()); //Send the result back to the user, but convert to type string first

});

router.post('/post/json', function (req, res) {

    function appendJSON(obj) {

        console.log(obj)

        xmlFileToJs('LittleIndian.xml', function (err, result) {
            
            if (err) throw (err);

            result.restaurantmenu.section[obj.sec_n].entree.push({ 'item': obj.item, 'price': obj.price });

            console.log(JSON.stringify(result, null, "  "));

            jsToXmlFile('LittleIndian.xml', result, function (err) {
            
                if (err) console.log(err);
            
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');

});

// POST request to add to JSON & XML files
router.post('/post/delete', function(req, res) {

  // Function to read in a JSON file, add to it & convert to XML
  function deleteJSON(obj) {
    
    console.log(obj)

    // Function to read in XML file, convert it to JSON, delete the required object and write back to XML file
    xmlFileToJs('LittleIndian.xml', function(err, result) {
      if (err) throw (err);
      //This is where we delete the object based on the position of the section and position of the entree, as being passed on from index.html
      delete result.restaurantmenu.section[obj.section].entree[obj.entree];
      
      console.log(JSON.stringify(result, null, "  "));
      
      //This is where we convert from JSON and write back our XML file
      jsToXmlFile('LittleIndian.xml', result, function(err) {
        if (err) console.log(err);
      })
    })
  }

  // Call appendJSON function and pass in body of the current POST request
  deleteJSON(req.body);

  res.redirect('back');

});

//* @param {string} name the content between the '&' and the ';'.
//* @return {string} a single unicode code-point as a string.
//*/
function lookupEntity(name) {
        // TODO: entity lookup as specified by HTML5 actually depends on the
        // presence of the ";".
        if (ENTITIES.hasOwnProperty(name)) { return ENTITIES[name]; }
        var m = name.match(decimalEscapeRe);
        if (m) {
            return String.fromCharCode(parseInt(m[1], 10));
        } else if (!!(m = name.match(hexEscapeRe))) {
            return String.fromCharCode(parseInt(m[1], 16));
        } else if (entityLookupElement && safeEntityNameRe.test(name)) {
            entityLookupElement.innerHTML = '&' + name + ';';
            var text = entityLookupElement.textContent;
            ENTITIES[name] = text;
            return text;
        } else {
            return '&' + name + ';';
        }
    }

//server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {

//    var addr = server.address();
//    console.log("Server listening at", addr.address + ":" + addr.port);

//});

// http.createServer((req, res)=>{
//   res.write(users.join(", ")); //display the list of users on the page
// //   res.write("\n\n"+emails.join(", ")); //display the list of users on the page
//   res.end(); //end the response
// }).listen(8000); // listen for requests on port 8000

// let users = []; // names of users will be stored here
// // let email = [];
// (async function getNames(){
//   try{
//     const {data} = await axios.get("https://swapi.dev/api/people");
//     console.log(data.results);
//     users = data.results.map(user=>user.name);
//     // emails = data.map(email=>email.email);
//     console.log(users);
//     // console.log(emails);
//   } catch(error){
//     console.log(error)
//   }
// })();

// mongoose.connect('mongodb://localhost/test');

// mongoose.connection.on('error', (err) => { 
//     console.log('Mongodb Error: ', err); 
//     process.exit();
// });
// mongoose.connection.on('connected', () => { 
//     console.log('MongoDB is successfully connected');
// });

app.listen(port, function(err){
    console.log('Listening on port: ' + port);
});

const dbURI = "mongodb://localhost/test";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => console.log('connected to db'))
        .catch((err) => console.log(err));
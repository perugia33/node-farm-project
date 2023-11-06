const fs = require('fs');
const http = require('http');
const url = require('url');


//  Server

const replaceTemplateItem = (temp, product)=> {
    let output = temp.replace(/{%PRODUCTNAME%}/g,   product.productName);
    output = output.replace(/{%IMAGE%}/g,   product.image);
    output = output.replace(/{%PRICE%}/g,   product.price);
    output = output.replace(/{%LOCATION%}/g,  product.from);
    output = output.replace(/{%NUTRIENTS%}/g,   product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,   product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,   product.description);
    output = output.replace(/{%ID%}/g,   product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,   'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,  'utf-8' );
const tempProduct = fs.readFileSync( `${__dirname}/templates/template-product.html`, 'utf-8' );
const tempCard = fs.readFileSync( `${__dirname}/templates/template-card.html`, 'utf-8' );

const styleCSS= fs.readFileSync( `${__dirname}/style.css`, 'utf-8' );


const data = fs.readFileSync('./json-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);
  

 const server = http.createServer((req, res) =>{
    const {query, pathname} = (url.parse(req.url, true));

    // CSS Stylesheet
    if(pathname ===  '/style.css'){
        res.writeHead(200,  { 'Content-type': 'text/css' });
        res.end(styleCSS);

    // Overview Page
     }else if(pathname ===  '/'  || pathname === '/overview'){
        res.writeHead(200,  { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplateItem(tempCard, el)).join( ' ');
        // creates an array with json data which is convert into one string   
         const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);             
         res.end(output);

    // Product Page
    } else if (pathname === '/product'){
        res.writeHead(200,  { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplateItem(tempProduct, product);
        res.end(output);

     // API
    } else if(pathname === '/api'){
            res.writeHead(200,  {
                'Content-type': 'application/json' });
                res.end(data);

     //  Not Found
    } else{
        res.writeHead(404, { 
            'Content-type': 'text/html'
        });
        res.end( '<h1>  Page not found   </h1>');
    }

 });
server.listen(8000, '127.0.0.1' ,   ()=> {
    console.log('Server is listening on port 8000')
});




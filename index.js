import http from 'http';
import fs from 'fs';
import url from 'url'


const requestHandler = (req, res) => {
    const { headers, method } = req;
    const parsedUrl = url.parse(req.url, true);
    let body = [];

    req.on('error', (err) => {
        console.error(err.stack);
    })


    if (method === "GET" && req.url === "/") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/create-message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>')
        res.write('</html>');
        return res.end();
    }

  
    if(method === "GET" && req.url.match(/^\/\?name=([^\/]+)/)  ){
       const name = parsedUrl.query.name;
        res.write( `Hello, ${name}`)
        res.end();
    }
   
    if (method === "GET" && req.url === "/messages") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Messages</title><head>');
        res.write('<body>')
        res.write('<ul>')
        res.write('<li>1 ---> Yatin<li><li>2 ---> Arpit<li>')
        res.write('<li>3 ---> Gautam<li><li>4 ---> Kritika<li>')
        res.write('</ul>')
        res.write('</body>')
        res.write('</html>');
        return res.end();

    }

    const regex = new RegExp('^/users/([^/]+)/messages/([^/]+)$');

    if (method === "GET" && req.url.match(regex)) {

        const userId = parsedUrl.pathname.split('/')[2];
        const msgId = parsedUrl.pathname.split('/')[4];

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Messages</title><head>');
        res.write('<body>')
        res.write('<ul>')
        res.write(`<li>User: ${userId}<li>`)
        res.write(`<li>Message Id : ${msgId}<li>`)
        res.write('</ul>')
        res.write('</body>')
        res.write('</html>');
        return res.end();

    }

   

    if (method === "POST" && req.url === "/create-message") {

        req.on('data', (chunk) => {
            body.push(chunk)
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString().split("=")[1]

            fs.writeFile('messages.txt', parsedBody, () => {
                res.statusCode = 302;
                res.setHeader('Location', './messages');
                return res.end();
            })
        })
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify("404 Page Not found"));
        return res.end();
    }

    res.on('error', (err) => {
        console.error(err);
    });


}

const app = http.createServer(requestHandler).listen(8000, () => {
    console.log("Server is up and listening on port 8000")
});


//   / ^\ /users\ /([^/]+)\/messages\/([^/]+)$ /
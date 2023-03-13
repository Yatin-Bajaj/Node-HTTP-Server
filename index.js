import http from "http";
import fs from "fs";
import url from "url";

const requestHandler = (req, res) => {
    const { method, url: REQUEST_URL } = req;
    const parsedUrl = url.parse(REQUEST_URL, true);
    let body = [];

    const REGEX = {
        name_regex: /^\/\?name=([^\/]+)/,
        msg_regex: /^\/users\/([^/]+)\/messages\/([^/]+)$/,
    };

    const EVENT = {
        DATA: "data",
        END: "end",
        ERROR: "error",
    };

    const HTTP_METHOD = {
        GET: "GET",
        POST: "POST",
    };

    req.on(EVENT.ERROR, (err) => {
        console.error(err.stack);
    });

    if (method === HTTP_METHOD.GET && REQUEST_URL === "/") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Enter Message</title><head>");
        res.write(
            '<body><form action="/create-message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>'
        );
        res.write("</html>");
        return res.end();
    }

    if (method === HTTP_METHOD.GET && REQUEST_URL.match(REGEX["name_regex"])) {
        const name = parsedUrl.query.name;
        res.write(`Hello, ${name}`);
        return res.end();
    }

    if (method === HTTP_METHOD.GET && REQUEST_URL === "/messages") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Messages</title><head>");
        res.write("<body>");
        res.write("<ul>");
        res.write("<li>1 ---> Yatin<li><li>2 ---> Arpit<li>");
        res.write("<li>3 ---> Gautam<li><li>4 ---> Kritika<li>");
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }

    if (method === HTTP_METHOD.GET && REQUEST_URL.match(REGEX["msg_regex"])) {
        const userId = parsedUrl.pathname.split("/")[2];
        const msgId = parsedUrl.pathname.split("/")[4];

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Messages</title><head>");
        res.write("<body>");
        res.write("<ul>");
        res.write(`<li>User: ${userId}<li>`);
        res.write(`<li>Message Id : ${msgId}<li>`);
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }

    if (method === HTTP_METHOD.POST && REQUEST_URL === "/create-message") {
        req.on(EVENT.DATA, (chunk) => {
            body.push(chunk);
        });

        req.on(EVENT.END, () => {
            const parsedBody = Buffer.concat(body).toString().split("=")[1];

            fs.writeFile("messages.txt", parsedBody, () => {
                console.log("Data written to file done", parsedBody);
            });
        });

        res.statusCode = 302;
        res.setHeader("Location", "./messages");
        return res.end();
    }

    res.on(EVENT.ERROR, (err) => {
        console.error(err);
    });

    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify("404 Page Not found"));
    return res.end();
};

const app = http.createServer(requestHandler).listen(8000, () => {
    console.log("Server is up and listening on port 8000");
});

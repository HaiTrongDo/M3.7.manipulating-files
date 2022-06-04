const http = require('http');
const fs = require('fs');
const qs = require('qs');


const server = http.createServer((req, res) => {
    let html;
    let dataFile;
    fs.readFile('./data/data.txt', "utf-8", (err, str) => {
        if(err){
            console.log(err)
        }
        dataFile = JSON.parse(str)
        console.log(dataFile)
        console.log(typeof dataFile)

        dataFile.forEach((element)=>{
            html +=`    <tr>
                    <td>${element["id"]}</td>
                    <td>${element["name"]}</td>
                    <td>${element["price"]}</td>
                    <td><button class="btn btn-danger">Delete</button></td>
                    <td><button class="btn btn-info">Update</button></td>
                    </tr>`
    })
    fs.readFile('./templates/productList.html', "utf-8", (err, data)=>{
        if(err){
            console.log(err)
        }
        data = data.replace('{list-user}', html);
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
        return res.end();
    })
    })
}).listen(5000,()=>{
    console.log(`server is listening on port:5000`)})
const http = require('http');
const fs = require('fs');
const qs = require('qs');


const server = http.createServer((req, res) => {
    if(req.method === "GET"){
        if (req.url === "/") {
            loadHomePage(res)
            return
        }
        if (req.url === "/showlist") {
            showList(req, res)
        }
    } else {
        createProduct(req,res)
    }


}).listen(5000, () => {
    console.log(`server is listening on port:5000`)
})

function createProduct(req,res){
    let newData=''
    let dataContent;
    req.on('data', chunk => {
        newData += chunk
        newData = qs.parse(newData)
    })
    req.on('end',()=>{
        fs.readFile('./data/data.txt',"utf-8", (err,str) => {
            if (err) {
                console.log(err.message)
            }
            dataContent = JSON.parse(str)
            dataContent.push(newData)
            fs.writeFile('./data/data.txt', JSON.stringify(dataContent), err => {
                    if (err) {
                        console.log('err')
                        return;
                    }
                    return res.end('Create success')
                }
            )
        })
    })
    req.on('error',()=>{
        console.log('error')
    })
}




function loadHomePage(res) {
    fs.readFile('./templates/index.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end()
    })
}


function showList(req, res) {
    let html;
    let dataFile;
    fs.readFile('./data/data.txt', "utf-8", (err, str) => {
        if (err) {
            console.log(err)
        }
        dataFile = JSON.parse(str)
        dataFile.forEach((element) => {
            html += `    <tr>
                    <td>${element["id"]}</td>
                    <td>${element["name"]}</td>
                    <td>${element["price"]}</td>
                    <td><button class="btn btn-danger">Delete</button></td>
                    <td><button class="btn btn-info">Update</button></td>
                    </tr>`
        })
        fs.readFile('./templates/productList.html', "utf-8", (err, data) => {
            if (err) {
                console.log(err)
            }
            data = data.replace('{list-user}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        })
    })
}
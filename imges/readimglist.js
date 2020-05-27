let fs = require('fs');
let ary = fs.readdirSync('./');
//console.log(ary);
let result = [];
ary.forEach(function (item) {
    if (/\.(PNG|GIF|JPG)/i.test(item)){
        result.push('imges/' + item);
    }
});
fs.writeFileSync('./result.txt',JSON.stringify(result),'utf-8');
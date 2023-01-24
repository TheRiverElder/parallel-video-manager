import express from 'express';
const app = express();

app.get('/', function (request, response) {
    const path: string = request.query["path"] as string || ".";
    response.sendFile(path);
});

export const resourceServerPort = 8888; 
console.log("[Resource Server] starting at port " + resourceServerPort); 
app.listen(resourceServerPort, () => { 
    console.log("[Resource Server] started at port " + resourceServerPort); 
});
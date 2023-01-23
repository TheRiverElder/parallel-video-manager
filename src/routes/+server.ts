import express from 'express';
const app = express();

app.get('/', function (request, response) {
  const path: string = request.query["path"] as string || ".";
  response.sendFile(path);
});

app.listen(8888, () => { console.log("resource server started at port 8888"); });
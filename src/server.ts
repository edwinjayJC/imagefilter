import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  const app = express();

  const port = process.env.PORT || 8082;
  
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.get("/filteredimage", async ( req : any, res : any ) => {
    let imageUrl = req.query.image_url;

    if (!imageUrl) {
      return res.status(400).send("Image URL missing or invalid");
    }

    const imagePath = await filterImageFromURL(imageUrl);

    res.sendFile(imagePath, function(){
      deleteLocalFiles([imagePath]);
    });
  });
  
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
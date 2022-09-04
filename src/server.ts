import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  const app: Express = express();

  const port = process.env.PORT || 8082;
  
  app.use(bodyParser.json());

  app.use(function(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.get("/filteredimage", async ( req: Request, res: Response ) => {
    let imageUrl = req.query.image_url;

    if (!imageUrl) {
      return res.status(400).send("Image URL missing or invalid");
    }

    const imagePath: string = await filterImageFromURL(imageUrl);

    res.sendFile(imagePath, function(){
      deleteLocalFiles([imagePath]);
    });
  });
  
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
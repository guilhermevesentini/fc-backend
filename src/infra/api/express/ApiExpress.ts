import { Api } from "../api";
import express, { Express } from "express";
import { Route } from "./routes/route";
import cors from 'cors';

export class ApiExpress implements Api {

  private app: Express

  private constructor(routes: Route[]) {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
    this.addRoutes(routes)
  }
  
  public static create(routes: Route[]){
    return new ApiExpress(routes)
  }

  private addRoutes(routes: Route[]) {
    routes.forEach((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();

      this.app[method](path, handler);

      this.app[method](
        path, 
        ...handler
      );
  });
  }

  start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      this.listRoutes();
  });
  }

  private listRoutes() {
    const routes = this.app._router.stack
      .filter((layer: any) => layer.route)
      .map((layer: any) => {
        const route = layer.route;
        return {
          path: route.path,
          method: route.stack[0].method,
        };
      });
  
    const uniqueRoutes = Array.from(
      new Map(routes.map((r: any) => [`${r.method}:${r.path}`, r])).values()
    );
  
    console.log(uniqueRoutes);
  }
}
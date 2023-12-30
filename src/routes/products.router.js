import { Router } from "express";
import {  productManager } from "../app.js";

const productsRouter = Router()

productsRouter.get("/",async (req,res)=>{
    try{
        const limit = parseInt(req.query.limit);
       
    const allProducts = await productManager.getProducts();

    if (isNaN(limit)) {
        res.json({ products: allProducts });
    } else {
        const limitedProducts = allProducts.slice(0, limit);

        if (limitedProducts.length < limit) {
            res.json({ message: "No hay suficientes productos disponibles."});
        } else {
            res.json({ products: limitedProducts });
        }
    }
    }catch(error){
        console.log(error);
        res.send("error con los productos")

    }
});

productsRouter.get ("/:pid",async (req, res) => {
    const { pid } = req.params;
    try{

    const products = await productManager.getProductsById(pid);

    if (products !== "Producto no encontrado"){
        res.json(products);
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
}catch(error){
    console.log(error);
    res.send("error al intentar traer un producto con el id")
}
})

productsRouter.post("/",async (req,res)=>{
   

    try{  
      
    const {title, description, price, thumbnail,code,stock,status = true ,category}= req.body
    const response = await productManager.addProduct( {title, description, price, thumbnail,code,stock,status,category})
    res.json(response)

}catch(error){
     console.log("error al intentar agregar producto");
    }
});


productsRouter.put("/:pid",async(req,res)=>{
    const {pid} = req.params
    try{
        const {title, description, price, thumbnail,code,stock,status= true,category}= req.body
    const response= await productManager.updateProduct( {title, description, price, thumbnail,code,stock,status,category})
    res.json(response)
}

    catch(error){
        console.log(`error al intentar cambiar producto ${pid}`);
    }
})



productsRouter.delete ("/:pid", async(req,res)=>{
const {pid}= req.params

    try{
        const result = await productManager.deleteProduct(pid)
        res.send(`${result} correctamente`)

    }catch(error){
        console.log(`error al intentar eliminar un producto ${pid}`);


    }


})

  
export default productsRouter;


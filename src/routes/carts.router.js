import { Router } from "express";
import { cartManager } from "../app.js";


const cartsRouter = Router(); 


cartsRouter.post("/", async (req,res)=>{

    try {
    const response = await cartManager.newCart()
    res.json(response)
    } catch (error) {
        console.log("ERROR AL CREAR CARRITO",error);
        res.send("error al crear carrito");
    }

});

cartsRouter.get ("/:cid", async(req, res)=>{
    
    const{cid}= req.params

    try {
        const response = await cartManager.getCartProducts(cid)
        res.json(response)
    } catch (error) {
        res.send("error  al intentar enviar productos al carrito")
    }
})
cartsRouter.post("/:cid/products/:pid", async(req,res)=>{
    
    const {cid, pid}= req.params

    try {
        await cartManager.addProductToCart(cid,pid)
        res.send("producto agregado con exito")
    } catch (error) {
        res.send("error al guardar producto al carrito")
    }
})




 export default cartsRouter;
import express from "express"
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import { ProductManager } from "./ProductsManager.js";
import { CartManager } from "./cartManager.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server as ServerIO } from "socket.io";
import { log } from "console";
import { v4 as uuidv4 } from 'uuid';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const productManager = new ProductManager()
export const cartManager = new CartManager()


const PORT= 8083;
const app= express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.get("/", async (req, res)=>{
        let allProducts = await productManager.getProducts()
        res.render("index", {
                title: "Handlebars",
                products : allProducts
        })
})

app.use("/api/products",productsRouter);
app.use("/api/carts", cartsRouter )


app.get('/realTimeProducts', async (req, res) => {
        try {
        const allProducts = await productManager.getProducts();
        res.render('realTimeProducts', { products: allProducts });
        } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).send('Error interno del servidor');
        }
});



const httpServer = app.listen(PORT,()=>{
        console.log( ` Escuchando en el puerto ${PORT}`);
})

const socketServer = new ServerIO(httpServer)


socketServer.on("connection", socket => {
        console.log("Cliente conectado");

socket.on('newProduct', async (product) => {
        try {
                console.log('Evento newProduct recibido en el servidor:', product);
                const newProduct = { ...product, id: uuidv4() };
                console.log('Nuevo producto con ID único:', newProduct);

        await productManager.addProduct(newProduct);
                console.log('Producto agregado exitosamente.', newProduct);

        
        const updatedProducts = await productManager.getProducts();

socketServer.emit('updateProducts', { products: updatedProducts });
                console.log('Todos los productos:', updatedProducts);
        } 
        catch (error) {
                console.error('Error al agregar un nuevo producto:', error);

socketServer.emit('updateProducts', { error: 'Error al agregar el producto' });}
        });

socket.on("deleteProduct", async (productId) => {
        try {
                await productManager.deleteProduct(productId);

        const updatedProducts = await productManager.getProducts()

socketServer.emit("updateProducts", { products: updatedProducts });
                console.log('Todos los productos:', updatedProducts);

        } catch (error) {
                console.error('Error al eliminar un producto:', error);

socketServer.emit('updateProducts', { error: 'Error al eliminar el producto' });
                }
        })
})


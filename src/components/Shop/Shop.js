import React, { useEffect, useState } from 'react';
import './Shop.css';
import { Link } from 'react-router-dom';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getStoredCard } from '../../utilities/fakedb';
import useProducts from '../../hooks/useProducts';


const Shop = () => {

    const [products, setProducts] =  useProducts([]);
    const [cart,setCart] = useState([]);

    // useEffect(()=>{
    //     fetch('products.json')
    //     .then(res=> res.json())
    //     .then(data=> setProducts(data))
    // },[])

    
    // get data from local Storage
    useEffect(()=>{
        const storedCart = getStoredCard();
        const savedCart = [];

        for(const id in storedCart){
            const addedProduct = products.find(product=> product.id ===id)
            if(addedProduct){
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                savedCart.push(addedProduct);
            }
        }
        setCart(savedCart);
        
    },[products])

    const handleAddToCart = (selectedProduct) =>{


        let newCart = [];
        const exists = cart.find(product=> product.id);

        if(!exists){
            selectedProduct.quantity = 1;
            newCart = [...cart,selectedProduct];

        }
        else{
            const rest = cart.filter(product=> product.id === selectedProduct.id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
            console.log(newCart);
        }

        setCart(newCart);
        addToDb(selectedProduct.id);
        
}



    return (
        <div className='shop-container'>

            <div className="products-container">
                {
                    products.map(product=><Product 
                    key={product.id} 
                    product={product}
                    handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/orders">
                        <h4>selected items:{cart.length}</h4>
                        <button>Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;
import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

//create a type
type ShoppingCartProviderProps = {
    children:ReactNode
}

type CartItem = {
  id: number;
  quantity: number;
};

//some actions we can do in our cart
type ShoppingCartContext = {
    openCart:()=>void,
    closeCart:()=>void,
    getItemQuantity:(id:number) => number,
    increaseCartQuantity:(id:number) => void,
    decreaseCartQuantity:(id:number) => void,
    removeFromCart:(id:number) => void,
    cartQuantity:number,
    cartItems:CartItem[]
}


const ShoppingCartContext = createContext({} as ShoppingCartContext);

//create personnalize Hook
export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

//create a provider
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    //data store cart
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    const cartQuantity = cartItems.reduce((quantity, item)=>item.quantity + quantity,0)

    function getItemQuantity(id:number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id:number){
        setCartItems(currItems => {
            //article not exist
            if(currItems.find(item => item.id === id) == null){
                //create article
                return [...currItems, {id, quantity:1}]
            }else{
                //returns liste of article
                return currItems.map(item => {
                    //update quantity by id in list
                    if(item.id === id){
                        return {...item, quantity:item.quantity + 1}
                    }else{
                        //no change list
                        return item
                    }
                })
            }
        })
    }
    function decreaseCartQuantity(id: number) {
      setCartItems((currItems) => {
        //one article exist, remove that in list
        if (currItems.find((item) => item.id === id)?.quantity === 1) {
          //remove article by id
          return currItems.filter(item => item.id !== id)
        } else { 
          //returns liste of article
          return currItems.map((item) => {
            //update quantity by id in list
            if (item.id === id) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              //no change list
              return item;
            }
          });
        }
      });
    }
    function removeFromCart(id:number){
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

  return (
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
import { createContext, ReactNode, useContext, useState } from "react";

//create a type
type ShoppingCartProviderProps = {
    children:ReactNode
}

//some actions we can do in our cart
type ShoppingCartContext = {
    getItemQuantity:(id:number) => number,
    increaseCartQuantity:(id:number) => void,
    decreaseCartQuantity:(id:number) => void,
    removeFromCart:(id:number) => void,
}

type CartItem = {
    id:number,
    quantity:number
}

const ShoppingCartContext = createContext({})

//create personnalize Hook
export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

//create a provider
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    //data store cart
    const [cartItems, setCartItems] = useState<CartItem[]>([])

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
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
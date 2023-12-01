import { createContext, useContext } from "react"

const contextSearchPlus = createContext({})

export const SearchPlusProvider = ({children, quantityPerScroll}) => {
  return <contextSearchPlus.Provider value={{quantityPerScroll}}>{children}</contextSearchPlus.Provider>
}

export const useSearchPlus = () => {
  const _context = useContext(contextSearchPlus)
  return _context
}

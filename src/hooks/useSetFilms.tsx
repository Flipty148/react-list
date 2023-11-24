import { useContext } from "react";
import SetFilmsContext from "../context/setFilmsContext";

const useSetFilms = () => useContext(SetFilmsContext);

export default useSetFilms

import { createContext } from "react";
import { Film } from "../types";

const SetFilmsContext = createContext<React.Dispatch<React.SetStateAction<Film[]>> | null>(null);

export default SetFilmsContext;

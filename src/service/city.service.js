import { get } from "./web.request";
import { api } from "../utils/constant";

export const fetchCityList = () => get(api.cityList);

import { useCallback, useState } from "react";
import { fetchCityList } from "service/city.service";
import { useEffectAsync } from "utils/hooks/useEffectAsync.hook";
import { showToast } from "utils/helper";

export const useCityEffect = () => {
    const [cityList, setCityList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getCityList = useCallback(async(isCanceled) => {
        try {
            setLoading(true);
            const response = await fetchCityList();
            if(response.status === 200) {
                setCityList(response.resultObject);
            } else {
                showToast(response.message, false);
            }
            
            if (isCanceled?.()) return;
        } catch(err) {
            setLoading(false);
            showToast(err.message, false);
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffectAsync(async (isCanceled) => {
        await getCityList(isCanceled);
    }, []);

    return {
        cityList,
        loading,
        getCityList
    }
}
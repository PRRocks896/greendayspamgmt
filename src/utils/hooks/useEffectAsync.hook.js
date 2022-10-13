import { useEffect } from "react";

export function useEffectAsync(callerEffect, dependencies = []) {
    return useEffect(() => {
        let canceled = false;
        const callerEffectReturn = callerEffect(() => canceled);

        return () => { 
            canceled = true;

            callerEffectReturn.then((func) => {
                if(func !== undefined) {
                    func();
                }
            });
        };    
    // eslint-disable-next-line
    }, dependencies)
}
import { useEffect, useState } from "react";

/**
 * A custom hook to create a timer.
 * @param timer The initial timer value as minutes.
 */
export function useTimer(timer: number = 5, action?: () => void) {
    const [time, setTime] = useState(timer);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time - 1);
        }, 1000);

        if (time === 0) {
            if (action) {
                action();
            }
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [time]);

    return time;
}

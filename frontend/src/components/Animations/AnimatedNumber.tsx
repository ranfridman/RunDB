import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const AnimatedNumber = ({ value }: { value: number }) => {
    // 1. Create a spring-based motion value
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
    });

    // 2. Map the motion value to a rounded integer string
    const displayValue = useTransform(springValue, (latest) =>
        Math.round(latest).toLocaleString()
    );

    // 3. Update the spring value whenever the prop changes
    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return <motion.span>{displayValue}</motion.span>;
};

export default AnimatedNumber;
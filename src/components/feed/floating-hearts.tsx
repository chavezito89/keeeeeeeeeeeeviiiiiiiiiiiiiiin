"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  trigger: number;
}

const HeartIcon = () => {
    const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 0.5}s`,
    };
    return <Heart className="floating-heart" style={style} />;
}

export function FloatingHearts({ trigger }: FloatingHeartsProps) {
    const [hearts, setHearts] = useState<number[]>([]);

    useEffect(() => {
        if (trigger > 0) {
            const newHeartId = Date.now();
            setHearts(prev => [...prev, newHeartId]);
            setTimeout(() => {
                setHearts(prev => prev.filter(id => id !== newHeartId));
            }, 5000); // Remove heart after animation duration
        }
    }, [trigger]);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {hearts.map(id => <HeartIcon key={id} />)}
        </div>
    );
}

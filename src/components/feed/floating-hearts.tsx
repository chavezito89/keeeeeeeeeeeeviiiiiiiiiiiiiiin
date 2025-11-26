"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  trigger: number;
}

const HeartIcon = ({ id }: { id: number }) => {
    const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 0.2}s`,
        fontSize: `${Math.random() * 16 + 12}px`, // This will control the size
    };
    return <Heart className="floating-heart" style={style} />;
}

export function FloatingHearts({ trigger }: FloatingHeartsProps) {
    const [hearts, setHearts] = useState<number[]>([]);

    useEffect(() => {
        if (trigger > 0) {
            const newHearts: number[] = [];
            // Generate a burst of hearts
            for (let i = 0; i < 10; i++) {
                const newHeartId = Date.now() + i;
                newHearts.push(newHeartId);
            }
            setHearts(prev => [...prev, ...newHearts]);

            // Set a timeout to remove all the newly added hearts
            setTimeout(() => {
                setHearts(prev => prev.filter(id => !newHearts.includes(id)));
            }, 5000); // Should be longer than animation duration
        }
    }, [trigger]);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {hearts.map(id => <HeartIcon key={id} id={id} />)}
        </div>
    );
}

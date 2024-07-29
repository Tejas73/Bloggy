import { useEffect, useState } from 'react';

export const SvgSquares = () => {
    const initialColors = Array.from({ length: 10 * 10 }, () => 'black');
    const [colors, setColors] = useState(initialColors);

    useEffect(() => {
        const changeColor = () => {
            const newColors = [...initialColors];
            const randomIndices = new Set();

            while (randomIndices.size < 17) {
                const randomIndex = Math.floor(Math.random() * newColors.length);
                randomIndices.add(randomIndex);
            }

            randomIndices.forEach(index => {
                newColors[index] = 'white';
            });

            setColors(newColors);
        };

        const intervalId = setInterval(changeColor, 700);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div>
            <svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <rect id="square" width="20" height="20" />
                </defs>

                <g transform="translate(2, 2)">
                    {Array.from({ length: 10 }).map((_, rowIndex) => (
                        <g key={rowIndex}>
                            {Array.from({ length: 10 }).map((_, colIndex) => (
                                <use
                                    key={colIndex}
                                    href="#square"
                                    x={colIndex * 24}
                                    y={rowIndex * 24}
                                    fill={colors[rowIndex * 10 + colIndex]}
                                />
                            ))}
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

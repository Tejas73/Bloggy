import { useEffect, useState } from 'react';

export const SvgSquares = () => {
    const initialColors = Array.from({ length: 10 * 10 }, () => 'black');
    const [colors, setColors] = useState(initialColors);

    useEffect(() => {
        const changeColor = () => {
            const newColors = [...initialColors];
            const randomIndices = new Set();

            while (randomIndices.size < 13) {
                const randomIndex = Math.floor(Math.random() * newColors.length);
                randomIndices.add(randomIndex);
            }

            randomIndices.forEach(index => {
                newColors[index] = 'white';
            });

            setColors(newColors);
        };

        const intervalId = setInterval(changeColor, 1000);

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


// export const SvgSquares = () => {
//     return (
//         <div>
//             <svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
//                 <defs>
//                     <rect id="square" width="20" height="20" fill="black" />
//                 </defs>

//                 <g transform="translate(2, 2)">
//                     <g>
//                         <use href="#square" x="0" y="0" />
//                         <use href="#square" x="24" y="0" />
//                         <use href="#square" x="48" y="0" />
//                         <use href="#square" x="72" y="0" />
//                         <use href="#square" x="96" y="0" />
//                         <use href="#square" x="120" y="0" />
//                         <use href="#square" x="144" y="0" />
//                         <use href="#square" x="168" y="0" />
//                         <use href="#square" x="192" y="0" />
//                         <use href="#square" x="216" y="0" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="24" />
//                         <use href="#square" x="24" y="24" />
//                         <use href="#square" x="48" y="24" />
//                         <use href="#square" x="72" y="24" />
//                         <use href="#square" x="96" y="24" />
//                         <use href="#square" x="120" y="24" />
//                         <use href="#square" x="144" y="24" />
//                         <use href="#square" x="168" y="24" />
//                         <use href="#square" x="192" y="24" />
//                         <use href="#square" x="216" y="24" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="48" />
//                         <use href="#square" x="24" y="48" />
//                         <use href="#square" x="48" y="48" />
//                         <use href="#square" x="72" y="48" />
//                         <use href="#square" x="96" y="48" />
//                         <use href="#square" x="120" y="48" />
//                         <use href="#square" x="144" y="48" />
//                         <use href="#square" x="168" y="48" />
//                         <use href="#square" x="192" y="48" />
//                         <use href="#square" x="216" y="48" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="72" />
//                         <use href="#square" x="24" y="72" />
//                         <use href="#square" x="48" y="72" />
//                         <use href="#square" x="72" y="72" />
//                         <use href="#square" x="96" y="72" />
//                         <use href="#square" x="120" y="72" />
//                         <use href="#square" x="144" y="72" />
//                         <use href="#square" x="168" y="72" />
//                         <use href="#square" x="192" y="72" />
//                         <use href="#square" x="216" y="72" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="96" />
//                         <use href="#square" x="24" y="96" />
//                         <use href="#square" x="48" y="96" />
//                         <use href="#square" x="72" y="96" />
//                         <use href="#square" x="96" y="96" />
//                         <use href="#square" x="120" y="96" />
//                         <use href="#square" x="144" y="96" />
//                         <use href="#square" x="168" y="96" />
//                         <use href="#square" x="192" y="96" />
//                         <use href="#square" x="216" y="96" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="120" />
//                         <use href="#square" x="24" y="120" />
//                         <use href="#square" x="48" y="120" />
//                         <use href="#square" x="72" y="120" />
//                         <use href="#square" x="96" y="120" />
//                         <use href="#square" x="120" y="120" />
//                         <use href="#square" x="144" y="120" />
//                         <use href="#square" x="168" y="120" />
//                         <use href="#square" x="192" y="120" />
//                         <use href="#square" x="216" y="120" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="144" />
//                         <use href="#square" x="24" y="144" />
//                         <use href="#square" x="48" y="144" />
//                         <use href="#square" x="72" y="144" />
//                         <use href="#square" x="96" y="144" />
//                         <use href="#square" x="120" y="144" />
//                         <use href="#square" x="144" y="144" />
//                         <use href="#square" x="168" y="144" />
//                         <use href="#square" x="192" y="144" />
//                         <use href="#square" x="216" y="144" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="168" />
//                         <use href="#square" x="24" y="168" />
//                         <use href="#square" x="48" y="168" />
//                         <use href="#square" x="72" y="168" />
//                         <use href="#square" x="96" y="168" />
//                         <use href="#square" x="120" y="168" />
//                         <use href="#square" x="144" y="168" />
//                         <use href="#square" x="168" y="168" />
//                         <use href="#square" x="192" y="168" />
//                         <use href="#square" x="216" y="168" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="192" />
//                         <use href="#square" x="24" y="192" />
//                         <use href="#square" x="48" y="192" />
//                         <use href="#square" x="72" y="192" />
//                         <use href="#square" x="96" y="192" />
//                         <use href="#square" x="120" y="192" />
//                         <use href="#square" x="144" y="192" />
//                         <use href="#square" x="168" y="192" />
//                         <use href="#square" x="192" y="192" />
//                         <use href="#square" x="216" y="192" />
//                     </g>
//                     <g>
//                         <use href="#square" x="0" y="216" />
//                         <use href="#square" x="24" y="216" />
//                         <use href="#square" x="48" y="216" />
//                         <use href="#square" x="72" y="216" />
//                         <use href="#square" x="96" y="216" />
//                         <use href="#square" x="120" y="216" />
//                         <use href="#square" x="144" y="216" />
//                         <use href="#square" x="168" y="216" />
//                         <use href="#square" x="192" y="216" />
//                         <use href="#square" x="216" y="216" />
//                     </g>
//                 </g>
//             </svg>
//         </div>
//     )
// }
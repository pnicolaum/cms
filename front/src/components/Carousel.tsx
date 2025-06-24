import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const prods = [
  { id: '1', name: 'Producto 1', description: 'Descripción del producto 1' },
  { id: '2', name: 'Producto 2', description: 'Descripción del producto 2' },
  { id: '3', name: 'Producto 3', description: 'Descripción del producto 3' },
  { id: '4', name: 'Producto 4', description: 'Descripción del producto 4' },
  { id: '5', name: 'Producto 5', description: 'Descripción del producto 5' },
];

export function Carousel() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, prods.length - visibleCount));
  };

  const visibleProducts = prods.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="max-w-xl mx-auto pb-4 pt-4 bg-white rounded-md shadow-sm relative flex items-center">
      {/* Flecha izquierda */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 absolute left-0 z-10"
        aria-label="Anterior"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      {/* Lista de productos */}
      <ul className="flex overflow-hidden w-[93%] px-12 gap-5">
        {visibleProducts.map(({ id, name, description }) => (
          <li
            key={id}
            className="flex-shrink-0 w-1/3 border rounded-md p-4 bg-gray-50 shadow-sm mr-0"
          >
            <h3 className="text-lg font-semibold mb-2">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </li>
        ))}
      </ul>

      {/* Flecha derecha */}
      <button
        onClick={handleNext}
        disabled={startIndex >= prods.length - visibleCount}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 absolute right-0 z-10"
        aria-label="Siguiente"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

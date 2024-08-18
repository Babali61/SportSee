import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour observer les changements de taille d'un élément DOM.
 * 
 * Ce hook utilise l'API ResizeObserver pour surveiller les changements de dimensions d'un élément référencé.
 * 
 * @param {Object} ref - Référence à l'élément DOM dont les dimensions doivent être observées.
 * @returns {Object|null} Les dimensions actuelles de l'élément observé, ou null si non disponibles.
 */

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;

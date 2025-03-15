import { useEffect, useState, useCallback } from 'react';

/**
 * Hook personnalisé pour observer les changements de taille d'un élément DOM.
 * Utilise ResizeObserver avec une optimisation des performances. ( API du navigateur intégrer nativement )
 * 
 * @param {Object} ref - Référence à l'élément DOM dont les dimensions doivent être observées.
 * @returns {Object|null} Les dimensions actuelles de l'élément observé, ou null si non disponibles.
 */
const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  // Utilisation de useCallback pour mémoriser la fonction de callback
  const resizeCallback = useCallback((entries) => {
    // Ne prendre que la première entrée car nous n'observons qu'un seul élément
    const entry = entries[0];
    
    if (entry) {
      // Utilisation de requestAnimationFrame pour optimiser les performances
      requestAnimationFrame(() => {
        setDimensions(entry.contentRect);
      });
    }
  }, []);

  useEffect(() => {
    const observeTarget = ref.current;
    
    if (!observeTarget) return;

    // Création d'une seule instance de ResizeObserver
    const resizeObserver = new ResizeObserver(resizeCallback);

    // Démarrage de l'observation
    resizeObserver.observe(observeTarget);

    // Nettoyage lors du démontage du composant
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, resizeCallback]);

  return dimensions;
};

export default useResizeObserver;

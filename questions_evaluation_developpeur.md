# Questions d'Évaluation Technique - SportSee

## 1. Questions sur D3.js

### 1.1 Graphique d'Activité Quotidienne
1. **Q**: Pourquoi avez-vous choisi d'utiliser `useResizeObserver` dans le composant GraphiqueActiviteQuotidienne ?
   **R**: 
   ```javascript
   // Hook personnalisé useResizeObserver
   const useResizeObserver = (ref) => {
     const [dimensions, setDimensions] = useState(null);
     useEffect(() => {
       const observeTarget = ref.current;
       const resizeObserver = new ResizeObserver(entries => {
         entries.forEach(entry => {
           setDimensions(entry.contentRect);
         });
       });
       resizeObserver.observe(observeTarget);
       return () => resizeObserver.unobserve(observeTarget);
     }, [ref]);
     return dimensions;
   };
   ```
   Ce hook permet de détecter les changements de taille du conteneur et de mettre à jour les dimensions du graphique en conséquence. Il utilise l'API ResizeObserver du navigateur qui est plus performante que les événements de redimensionnement traditionnels. Le hook est optimisé avec un nettoyage propre des observateurs pour éviter les fuites de mémoire.

2. **Q**: Comment avez-vous implémenté les barres avec coins arrondis ?
   **R**: 
   ```javascript
   const roundedTopPath = (x, y, width, height, radius) => {
     return `
       M ${x},${y + radius}
       a ${radius},${radius} 0 0 1 ${radius},-${radius}
       h ${width - 2 * radius}
       a ${radius},${radius} 0 0 1 ${radius},${radius}
       v ${height - radius}
       h -${width}
       Z
     `;
   };
   ```
   Cette fonction utilise les commandes SVG path pour créer des coins arrondis en haut des barres. Le chemin SVG est construit avec :
   - `M` pour déplacer le point de départ
   - `a` pour créer des arcs de cercle pour les coins arrondis
   - `h` et `v` pour les lignes horizontales et verticales
   - `Z` pour fermer le chemin
   Le rayon des coins est paramétrable, ce qui permet d'ajuster l'apparence des barres.

3. **Q**: Pourquoi avoir utilisé deux axes Y différents ?
   **R**: 
   ```javascript
   // Échelle pour l'axe des poids
   const yRight = d3
     .scaleLinear()
     .domain([minWeight, maxWeight + 2])
     .range([height, 30]);

   // Échelle pour l'axe des calories
   const yLeft = d3
     .scaleLinear()
     .domain([0, d3.max(data, (d) => d.calories) * 2])
     .range([height, 0]);
   ```
   Les deux échelles permettent d'afficher des données dans des plages très différentes sur le même graphique. L'axe de droite (yRight) est utilisé pour les poids en kilogrammes, avec une échelle adaptée à la plage de poids de l'utilisateur. L'axe de gauche (yLeft) est utilisé pour les calories, avec une échelle qui commence à 0 et s'étend jusqu'au double de la valeur maximale pour assurer une bonne visibilité des variations.

### 1.2 Graphique Radar de Performance
1. **Q**: Comment avez-vous géré le positionnement des labels ?
   **R**: 
   ```javascript
   const angleSlice = (Math.PI * 2) / data.length;
   axisGrid.selectAll('.axis')
     .data(data)
     .enter()
     .append('g')
     .attr('class', 'axis')
     .each(function (d, i) {
       const g = d3.select(this);
       const x = radius * 1.1 * Math.cos(angleSlice * i - Math.PI / 2);
       const y = radius * 1.1 * Math.sin(angleSlice * i - Math.PI / 2);
       g.append('text')
         .attr('x', x)
         .attr('y', y)
         .text(d.kind);
     });
   ```
   Le positionnement des labels est calculé en utilisant des coordonnées polaires. Chaque label est placé à une distance de 1.1 fois le rayon du graphique, ce qui le positionne légèrement à l'extérieur du radar. L'angle est calculé en divisant le cercle complet (2π) par le nombre de points de données, et chaque label est placé en utilisant les fonctions cosinus et sinus pour obtenir les coordonnées x et y.

2. **Q**: Pourquoi avoir choisi `curveLinearClosed` ?
   **R**: 
   ```javascript
   const radarLine = d3.line()
     .x((d, i) => radius * (d.value / 250) * Math.cos(angleSlice * i - Math.PI / 2))
     .y((d, i) => radius * (d.value / 250) * Math.sin(angleSlice * i - Math.PI / 2))
     .curve(d3.curveLinearClosed);
   ```
   La courbe `curveLinearClosed` est utilisée car elle crée une ligne fermée qui relie tous les points de données avec des segments droits. C'est le choix idéal pour un graphique radar car :
   - Elle crée une forme polygonale claire
   - Elle permet de visualiser facilement les variations entre les différentes catégories
   - Elle est plus lisible qu'une courbe lissée pour ce type de données

### 1.3 Graphique de Durée des Sessions
1. **Q**: Comment avez-vous implémenté le dégradé ?
   **R**: 
   ```javascript
   const defs = svg.append("defs");
   const gradient = defs.append("linearGradient")
     .attr("id", "line-gradient")
     .attr("x1", "0%")
     .attr("y1", "0%")
     .attr("x2", "100%")
     .attr("y2", "0%");
   
   gradient.append("stop")
     .attr("offset", "0%")
     .attr("stop-color", "rgba(225, 225, 225, 0.7)");
   gradient.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", "rgb(225, 225, 225)");
   ```
   Le dégradé est implémenté en utilisant les éléments SVG `defs` et `linearGradient`. Le dégradé est horizontal (x1="0%" à x2="100%") et utilise deux points d'arrêt (stops) :
   - Un point à 0% avec une couleur semi-transparente
   - Un point à 100% avec une couleur opaque
   Cela crée un effet de fondu qui donne de la profondeur à la ligne.

2. **Q**: Pourquoi avoir choisi `curveCatmullRom` ?
   **R**: 
   ```javascript
   const line = d3.line()
     .x((d, i) => xLine(i))
     .y(d => y(d.sessionLength))
     .curve(d3.curveCatmullRom.alpha(0.5));
   ```
   La courbe `curveCatmullRom` est utilisée car elle crée une interpolation plus naturelle entre les points. Le paramètre alpha=0.5 permet de :
   - Créer une courbe plus lisse que les segments droits
   - Éviter les oscillations excessives
   - Mieux représenter la progression naturelle des sessions dans le temps

### 1.4 Jauge de Score
1. **Q**: Comment avez-vous calculé les angles ?
   **R**: 
   ```javascript
   const startAngle = -Math.PI / 2;
   const endAngle = Math.PI * 2;
   const arc = d3.arc()
     .innerRadius(innerRadius)
     .outerRadius(outerRadius)
     .startAngle(startAngle)
     .endAngle(d => startAngle + (endAngle - startAngle) * d.value);
   ```
   Les angles sont calculés en radians :
   - `startAngle = -Math.PI / 2` place le début de l'arc à 12h
   - `endAngle = Math.PI * 2` représente un tour complet
   - L'angle final est calculé proportionnellement à la valeur du score
   Cela crée une jauge circulaire qui se remplit de bas en haut.

## 2. Questions sur l'Architecture

### 2.1 Services API
1. **Q**: Pourquoi avoir choisi un pattern Singleton ?
   **R**: 
   ```javascript
   const apiService = {
     getUserActivity: async (userId) => {
       try {
         const response = await fetch(`/user/${userId}/activity`);
         return await response.json();
       } catch (error) {
         console.error('Error fetching activity:', error);
         throw error;
       }
     },
     // ... autres méthodes
   };
   export default apiService;
   ```
   Le pattern Singleton est utilisé pour :
   - Assurer une seule instance du service API dans l'application
   - Centraliser la gestion des appels API
   - Faciliter la gestion du cache et des états de connexion
   - Éviter la duplication des configurations

2. **Q**: Comment gérez-vous le basculement entre données mockées et API ?
   **R**: 
   ```javascript
   const useMockData = process.env.REACT_APP_USE_MOCK === 'true';
   
   const apiService = {
     getUserActivity: async (userId) => {
       if (useMockData) {
         return mockData.activity;
       }
       return await fetch(`/user/${userId}/activity`).then(r => r.json());
     }
   };
   ```
   Le basculement est géré via une variable d'environnement :
   - En développement, on peut utiliser les données mockées
   - En production, on utilise l'API réelle
   - La transition est transparente pour les composants qui utilisent le service

### 2.2 Gestion des Données
1. **Q**: Pourquoi avoir créé une classe `UserData` ?
   **R**: 
   ```javascript
   class UserData {
     constructor(data) {
       this.validateData(data);
       this.data = data;
     }
     
     validateData(data) {
       if (!data || typeof data !== 'object') {
         throw new Error('Invalid data format');
       }
     }
     
     formatActivityData() {
       return this.data.map(item => ({
         ...item,
         day: this.formatDate(item.day)
       }));
     }
   }
   ```
   La classe `UserData` permet de :
   - Valider les données à leur réception
   - Centraliser la logique de transformation des données
   - Assurer la cohérence des formats de données
   - Faciliter la maintenance et les modifications

## 3. Questions sur les Performances

1. **Q**: Quelles optimisations pour les animations ?
   **R**: 
   ```javascript
   svg.selectAll(".bar-kilogram")
     .data(data)
     .enter()
     .append("path")
     .transition()
     .duration(600)
     .delay((d, i) => i * 100)
     .ease(d3.easeElastic);
   ```
   Les animations sont optimisées avec :
   - Une durée de 600ms pour un bon compromis entre fluidité et rapidité
   - Un délai progressif pour créer un effet de cascade
   - L'utilisation de `easeElastic` pour un effet plus naturel
   - La réutilisation des transitions existantes

2. **Q**: Comment gérez-vous la mémoire ?
   **R**: 
   ```javascript
   useEffect(() => {
     // Code de création du graphique
     return () => {
       d3.select(svgRef.current).selectAll("*").remove();
     };
   }, [data]);
   ```
   La gestion de la mémoire est assurée par :
   - Le nettoyage des éléments SVG lors du démontage du composant
   - L'utilisation de `useEffect` pour gérer le cycle de vie
   - La suppression des anciens éléments avant de créer les nouveaux

## 4. Questions sur la Maintenance

1. **Q**: Comment faciliter l'ajout d'un nouveau graphique ?
   **R**: 
   ```javascript
   // Pattern commun pour tous les graphiques
   const BaseGraph = ({ data, children }) => {
     const svgRef = useRef();
     const dimensions = useResizeObserver(svgRef);
     
     useEffect(() => {
       if (!dimensions) return;
       // Logique commune de mise en place
     }, [dimensions]);
     
     return <svg ref={svgRef}>{children}</svg>;
   };
   ```
   Le pattern `BaseGraph` permet de :
   - Centraliser la logique commune à tous les graphiques
   - Réutiliser la gestion des dimensions
   - Standardiser la structure des composants
   - Faciliter l'ajout de nouvelles fonctionnalités

## 5. Questions sur les Bonnes Pratiques

1. **Q**: Pourquoi séparer la logique D3.js dans des `useEffect` ?
   **R**: 
   ```javascript
   const GraphComponent = ({ data }) => {
     const svgRef = useRef();
     
     // Logique de composant React
     const [error, setError] = useState(null);
     
     // Logique D3.js séparée
     useEffect(() => {
       if (!data) return;
       const svg = d3.select(svgRef.current);
       // Création du graphique
     }, [data]);
     
     return <svg ref={svgRef} />;
   };
   ```
   La séparation de la logique permet de :
   - Isoler les manipulations DOM de D3.js
   - Éviter les conflits avec le cycle de vie React
   - Faciliter les tests unitaires
   - Améliorer la maintenabilité du code

## 6. Questions sur les Tests

1. **Q**: Quels types de tests ?
   **R**: 
   ```javascript
   // Test unitaire pour la transformation des données
   test('UserData formats activity data correctly', () => {
     const userData = new UserData(mockData);
     const formatted = userData.formatActivityData();
     expect(formatted[0].day).toBe('2021-01-01');
   });
   
   // Test d'intégration pour les interactions
   test('Graph responds to hover events', async () => {
     const { container } = render(<GraphComponent data={testData} />);
     const bar = container.querySelector('.bar');
     fireEvent.mouseOver(bar);
     expect(container.querySelector('.tooltip')).toBeVisible();
   });
   ```
   Les tests couvrent :
   - La transformation des données
   - Les interactions utilisateur
   - Le rendu des composants
   - Les cas d'erreur

## 7. Questions sur l'Expérience Utilisateur

1. **Q**: Comment optimiser les performances ?
   **R**: 
   ```javascript
   // Lazy loading des composants
   const GraphComponent = React.lazy(() => import('./GraphComponent'));
   
   // Memoization des calculs
   const formatData = useMemo(() => {
     return data.map(item => heavyComputation(item));
   }, [data]);
   ```
   Les optimisations incluent :
   - Le chargement différé des composants
   - La mémorisation des calculs coûteux
   - La réduction des re-rendus inutiles

2. **Q**: Comment gérer les états de chargement ?
   **R**: 
   ```javascript
   const GraphComponent = ({ data }) => {
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);
     
     useEffect(() => {
       setIsLoading(true);
       fetchData()
         .then(data => {
           setData(data);
           setIsLoading(false);
         })
         .catch(error => {
           setError(error);
           setIsLoading(false);
         });
     }, []);
     
     if (isLoading) return <LoadingSpinner />;
     if (error) return <ErrorDisplay error={error} />;
     return <Graph data={data} />;
   };
   ```
   La gestion des états inclut :
   - Un indicateur de chargement
   - Une gestion des erreurs
   - Des retours visuels pour l'utilisateur
   - Une expérience utilisateur fluide

## 8. Points d'Amélioration Potentiels

1. **Tests**
   - Implémenter des tests unitaires pour les composants graphiques
   - Ajouter des tests d'intégration pour le service API
   - Mettre en place des tests de performance

2. **Gestion des États**
   - Ajouter des états de chargement pour améliorer l'expérience utilisateur
   - Implémenter une gestion d'erreur plus robuste avec des composants dédiés

3. **Architecture**
   - Créer un pattern commun pour les graphiques
   - Centraliser la logique de gestion des dimensions
   - Améliorer la réutilisabilité des composants

## 9. Recommandations pour l'Examen

1. **Vérifications Techniques**
   - Tester le basculement entre données mockées et API
   - Vérifier la réactivité des graphiques
   - Tester la gestion des erreurs

2. **Points d'Attention**
   - Performance des animations
   - Gestion de la mémoire
   - Qualité du code et documentation

3. **Évaluation des Compétences**
   - Compréhension de D3.js
   - Maîtrise des hooks React
   - Gestion des états et des effets
   - Architecture et design patterns 
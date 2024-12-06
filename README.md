# Utility gen-uniqueid

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/LargatSeif/gen-uniqueid)

## Indicateurs/Mesures utilisés: 

### **Fréquences des caractères** : 
Il s'agit de la distribution du nombre d'occurrences de chaque caractère dans l'échantillon généré.
L'objectif est de vérifier si chaque caractère apparaît de manière équilibrée ou si certains caractères sont utilisés plus fréquemment que d'autres, ce qui pourrait indiquer un biais.

### **Chi-Carré** / **Khi-deux**: 
Le test du Chi-Carré mesure la différence entre les fréquences observées et les fréquences attendues dans une distribution. Il permet d'évaluer si la distribution des caractères est uniforme ou si certains caractères sont sous-représentés ou sur-représentés.

### **Entropie de Shannon**:
L'entropie est une mesure de l'incertitude ou de la "désorganisation" dans un système.

Plus l'entropie est élevée, plus l'aléa est grand, ce qui signifie que les résultats sont imprévisibles.

En d'autres termes, une haute entropie indique un bon mélange ou une bonne dispersion des résultats.

### **Test des séquences**:
Le test des séquences (ou test des "runs") examine la longueur des séquences continues de caractères similaires dans un ensemble de données.

Un "run" est une séquence de caractères identiques (par exemple, deux 'A' consécutifs). Ce test permet de vérifier si la séquence des caractères suit un modèle aléatoire ou présente des patterns répétitifs.

Un score Z élevé indique que les caractères sont bien mélangés et qu'il n'y a pas de patterns détectables.
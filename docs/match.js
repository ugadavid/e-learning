
    $(function () {
        let words = []; // Liste des mots
        let currentIndex = 0; // Index du mot actuel
        let correctCount = 0; // Compteur de bonnes réponses
        let wrongCount = 0; // Compteur de mauvaises réponses
        let history = []; // Historique des réponses

        // Charger le fichier words.txt
        fetch('words.txt')
            .then(response => response.text())
            .then(data => {
                // Transformer le contenu du fichier en un tableau
                words = data.split('\n').map(line => {
                    let [word, article] = line.split(',').map(s => s.trim());
                    return { word, article };
                });
                showNextWord(); // Afficher le premier mot
            })
            .catch(err => console.error("Erreur lors du chargement du fichier :", err));

        // Fonction pour afficher le prochain mot
        function showNextWord() {
            if (currentIndex < words.length) {
                // Mettre à jour le texte et repositionner la carte
                $('#word-card')
                    .text(words[currentIndex].word)
                    .css({
                        top: 'auto',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '10px'
                    })
                    .fadeIn("fast");
            } else {
                displayHistory(); // Afficher l'historique à la fin
            }
        }

        // Fonction pour afficher l'historique
        function displayHistory() {
            // Remplacer la div word-card par une div à deux colonnes
            $('#word-card').replaceWith(`
                <div id="history-container" style="display: flex; justify-content: space-around; margin-top: 20px;">
                    <div id="correct-answers" style="flex: 1; margin-right: 10px;">
                        <h3>Bonnes réponses (${correctCount})</h3>
                        <ul style="list-style: none; padding: 0;"></ul>
                    </div>
                    <div id="wrong-answers" style="flex: 1; margin-left: 10px;">
                        <h3>Mauvaises réponses (${wrongCount})</h3>
                        <ul style="list-style: none; padding: 0;"></ul>
                    </div>
                </div>
            `);

            // Remplir les colonnes avec l'historique
            history.forEach(item => {
                const listItem = `<li>${item.word} (${item.article})</li>`;
                if (item.correct) {
                    $('#correct-answers ul').append(listItem);
                } else {
                    $('#wrong-answers ul').append(listItem);
                }
            });

            console.log("Exercice terminé !");
            console.log("Historique des réponses :", history);
        }

        // Rendre la carte draggable
        $("#word-card").draggable({
            start: function (event, ui) {
                var $this = $(this);
                var offset = $this.offset();
                var width = $this.outerWidth();
                var height = $this.outerHeight();
                var $container = $(".exercise-container");
                var cOffset = $container.offset();
                var cHeight = $container.height();
                var newTop = cOffset.top + cHeight - height - 10;
                var newLeft = offset.left;

                $this.css({
                    bottom: 'auto',
                    transform: 'none',
                    top: newTop + 'px',
                    left: newLeft + 'px'
                });
            }
        });

        // Rendre les zones Masculin et Féminin droppable
        $("#masculin, #feminin").droppable({
            accept: "#word-card",
            drop: function (event, ui) {
                var $chocolat = ui.draggable;
                var targetId = $(this).attr("id"); // Récupérer l'identifiant de la div cible
                console.log("Carte relâchée sur :", targetId);

                // Vérification du genre attendu
                const currentWord = words[currentIndex];
                const expectedGender = currentWord.article === 'le' ? 'masculin' : 'feminin';
                const isCorrect = targetId === expectedGender;

                // Mettre à jour l'historique
                history.push({
                    word: currentWord.word,
                    article: currentWord.article,
                    correct: isCorrect
                });

                if (isCorrect) {
                    correctCount++;
                    console.log("Bonne réponse !");
                } else {
                    wrongCount++;
                    console.log("Mauvaise réponse !");
                }

                currentIndex++; // Passer au mot suivant

                // Attendre 2 secondes avant d'afficher le mot suivant
                setTimeout(function () {
                    showNextWord();
                }, 2000);
            }
        });
    });

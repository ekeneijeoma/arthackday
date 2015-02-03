function setup() {
    createCanvas(windowWidth, windowHeight);

    word = 'SEVENTYFIVE' 

    words = [
        'UNITED STATES',
        'MEXICO',
        'BRAZIL',
        'IRAN',
        'ISLAMIC REPUBLIC',
        'TURKEY',
        'EGYPT',
        'NIGERIA',
        'CONGO',
        // 'DEMOCRATIC REPUBLIC',
        'ETHIOPIA',
        'TANZANIA',
        'CHINA',
        'PAKISTAN',
        'PHILLIPPINES',
        'VIETNAM',
        'INDONESIA',
        'THAILAND',
        'MYANMAR',
        'BANGLADESH',
        // 'RUSSIAN FEDERATION'
        'RUSSIA',
        'RURAL',
        'LOW INCOME',
        'ELDERLY',
        'ILLITERATE',
        'FEMALE',
        'INCENTIVES',
        'AFFORDABILITY',
        'USER CAPABILITY',
        'INFRASTRUCTURE'
    ];

    letterWordRepeat = 2;

    letterCount = 0;
    wordCount = 0;

    wordDuration = 75;

    titleDuration = 12500;
    titleLetterDuration = 500;
    captionDuration = 1000;

    currentLetter = '';
    currentWord = '';

    ended = false;

    titleHeight = width * .125
    titleBottomMargin = titleHeight * .1;

    captionHeight = max(width * .015, 14)
    captionLineHeight = captionHeight + captionHeight * .5;

    textFont('Helvetica Neue, Helvetica, Arial, sans-serif')
    textStyle(BOLD)
    textSize(titleHeight)

    noStroke();

    backgroundColor = 255;

    setupSequence();
}

function setupSequence() {
    MOTION.removeAll();

    titleLetters = []

    titleLettersSequence = new MOTION.Sequence();

    titleLettersSequence.add(new MOTION.Tween(captionDuration)
        .add('captionColor', [0, 255])
        .add('titleColor', [0, 255]))

    titleLettersSequence.add(new MOTION(titleDuration))

    titleLettersSequence
        .onStart(function() {
            backgroundTween = new MOTION.Tween('backgroundColor', [0, 255], this.duration()).play()
        }).onEnd(function() {
            ended = false;
            lettersSequence.play()
        })

    letters = [];
    letters.offset = textWidth(word) / 2;

    letters.x = width / 2 - letters.offset;
    letters.y = height / 2;

    for (var i = 0; i < word.length; i++) {
        var letter = word.charAt(i);
        var letterWords = [];

        for (var j in words)
            for (var k in words[j])
                if (words[j][k] === letter)
                    for (var l = 0; l < letterWordRepeat; l++)
                        letterWords.push({
                            word: words[j],
                            index: k,
                            offset: textWidth(words[j].substring(0, k))
                        })

        letters.push({
            letter: letter,
            offset: textWidth(word.substring(0, i)),
            words: shuffle(letterWords)
        })
    }

    lettersSequence = new MOTION.Sequence();

    for (var i in letters) {
        for (var j in letters[i].words) {
            var m = new MOTION(wordDuration).onStart(function() {
                currentLetter = this.letter;
                currentWord = this.word;
            });
            m.letter = letters[i];
            m.word = letters[i].words[j];

            lettersSequence.add(m)
        }
    }

    lettersSequence
        .onStart(function() {
            backgroundTween = new MOTION.Tween('backgroundColor', [255, 0], this.duration()).play()
        })
        .onEnd(function() {
            ended = true;
            titleLettersSequence.play();
        })
        .play()

    // titleLettersSequence.play().onEnd(function() {});
}

function draw() {
    MOTION.update(millis());

    background(backgroundColor);

    if (!ended) {
        textSize(titleHeight)
        textAlign(LEFT);

        fill(lettersSequence.position() * 255)
        text(currentWord.word, letters.x + currentLetter.offset - currentWord.offset, letters.y)

        fill(255)
        text(currentLetter.letter, letters.x + currentLetter.offset, letters.y)
    } else {
        textSize(titleHeight)
        textAlign(LEFT);

        fill(titleColor)
        text(word, letters.x, letters.y)

        textSize(captionHeight)
        textAlign(CENTER);
        fill(captionColor)
        text('percent of the 4.4 billion people offline worldwide are in 20 countries', width / 2, letters.y + titleBottomMargin + captionLineHeight)
        text('including the U.S., which has 50 million; 1 out of 6 people...', width / 2, letters.y + titleBottomMargin + captionLineHeight * 2)
    }
}

function pause() {
    lettersSequence.pause();
    backgroundTween.pause();
}

function resume() {
    if (!lettersSequence.isPlaying()) {
        lettersSequence.resume();
        backgroundTween.resume();
    }
}

function mouseMoved() {
    if (ended) return false;

    if (e.clientY > height / 2 - titleHeight && e.clientY < height / 2)
        pause();
    else
        resume();
}

function touchStarted() {
    pause();
}

function touchEnded() {
    resume();
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

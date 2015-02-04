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

    currentLetter = '';
    letterCount = 0;
    letterWordRepeat = 2;
    letterFadeDuration = 1000;

    currentWord = '';
    wordCount = 0;
    wordDuration = 90;

    titleColor = 255;
    titleDuration = 15000;

    captionDuration = 1000;

    backgroundColor = 255;

    textFont('Helvetica Neue, Helvetica, Arial, sans-serif');
    textStyle(BOLD);

    noStroke();

    setupAnimation();
}

function setupAnimation() {
    titleHeight = width * .125
    captionHeight = max(width * .015, 14);;

    textSize(titleHeight);

    MOTION.removeAll();

    ended = false;

    titleLettersSequence = new MOTION.Sequence();

    titleLettersSequence.add(new MOTION.Tween(captionDuration)
            .add('captionColor', [0, 255]))
        // .add('titleColor', [0, 255]))

    titleLettersSequence.add(new MOTION(titleDuration))

    titleLettersSequence
        .onStart(function() {
            backgroundColorTween = new MOTION.Tween('backgroundColor', [0, 255], this.duration()).play()
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
            backgroundColorTween = new MOTION.Tween('backgroundColor', [255, 0], this.duration()).play()
            titleColorTween = new MOTION.Sequence()
                .add(new MOTION.Tween('titleColor', [255, 0], letterFadeDuration))
                .add(new MOTION.Tween('titleColor', [0, 255], this.duration() - letterFadeDuration))
                .play()
        })
        .onEnd(function() {
            ended = true;
            titleLettersSequence.play();
        })
        .play()

    // titleLettersSequence.play().onEnd(function() {});
}

function pauseSequence() {
    lettersSequence.pause();
    titleColorTween.pause();
    backgroundColorTween.pause();
}

function resumeSequence() {
    if (!lettersSequence.isPlaying()) {
        lettersSequence.resume();
        titleColorTween.resume();
        backgroundColorTween.resume();
    }
}

function draw() {
    MOTION.update(millis());

    background(backgroundColor);
    // blur(3);
    //     Filters.filterImage(Filters.convolute, image,
    //   [ 1/9, 1/9, 1/9,
    //     1/9, 1/9, 1/9,
    //     1/9, 1/9, 1/9 ]
    // );

    if (!ended) {
        textSize(titleHeight)
        textAlign(LEFT);

        fill(titleColor)
        text(1, letters.x, letters.y)
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
        text('percent of the 4.4 billion people offline worldwide are in 20 countries\nincluding the U.S., which has 50 million; 1 out of 6 people...', width / 2, letters.y + captionHeight * 2)
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); 
    setupAnimation();
}

function mouseMoved() {
    if (ended) return false;

    if (mouseY > height / 2 - titleHeight && mouseY < height / 2)
        pauseSequence();
    else
        resumeSequence();
}

function touchStarted() {
    pauseSequence();
}

function touchEnded() {
    resumeSequence();
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

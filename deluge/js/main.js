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

    //number of websites from 1991 to 2013
    websites = [1, 10, 130, 2738, 23500, 257601, 1117255, 2410067, 3177453, 17087182, 29254370, 38760373, 40912332, 51611646, 64780617, 85507314, 121892559, 172338726, 238027855, 206956723, 346004403, 697089489, 672985183];
    scaledWebsites = websites.map(function(d) {
        return d / websites[websites.length - 1]
    })

    currentLetter = '';
    letterCount = 0;
    letterWordRepeat = 2;
    letterFadeDuration = 1000;

    currentWord = '';
    wordCount = 0;
    wordDuration = 90;

    titleHeight = width * .125
    titleBottomMargin = titleHeight * .25;
    titleColor = 255;
    titleDuration = 12500;

    captionHeight = max(width * .015, 14)
    captionDuration = 1000;

    backgroundColor = 255;

    ended = false;

    textFont('Helvetica Neue, Helvetica, Arial, sans-serif');
    textStyle(BOLD);

    noStroke();

    setupAnimation();
}

function setupAnimation() {
    titleHeight = width * .125
    titleBottomMargin = titleHeight * .25;

    captionHeight = max(width * .015, 14)

    textSize(titleHeight);

    titleLetters = []

    MOTION.removeAll();

    titleLettersSequence = new MOTION.Sequence();

    titleLettersSequence.add(new MOTION.Tween(captionDuration)
        .add('captionColor', [0, 255]))
    // .add('titleColor', [0, 255]))

    titleLettersSequence.add(new MOTION(titleDuration));

    titleLettersSequence
        .onStart(function() {
            backgroundColorTween = new MOTION.Tween('backgroundColor', [0, 255], this.duration()).play()
        }).onEnd(function() {
            ended = false;
            lettersSequence.play();
        });

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
                        });

        letters.push({
            letter: letter,
            offset: textWidth(word.substring(0, i)),
            words: shuffle(letterWords)
        });
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

            lettersSequence.add(m);
        }
    }

    lettersSequence
        .onStart(function() {
            backgroundColorTween = new MOTION.Tween('backgroundColor', [255, 0], this.duration()).play()
            titleColorTween = new MOTION.Sequence()
                .add(new MOTION.Tween('titleColor', [255, 0], letterFadeDuration))
                .add(new MOTION.Tween('titleColor', [0, 255], this.duration() - letterFadeDuration))
                .play();
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
        textSize(titleHeight);
        textAlign(LEFT);

        fill(titleColor);
        text(1, letters.x, letters.y);
        text(currentWord.word, letters.x + currentLetter.offset - currentWord.offset, letters.y);

        fill(255)
        text(currentLetter.letter, letters.x + currentLetter.offset, letters.y);
    } else {
        textSize(titleHeight);
        textAlign(LEFT);

        fill(titleColor);
        text(word, letters.x, letters.y);

        textSize(captionHeight);
        textAlign(CENTER);
        fill(captionColor);
        text('percent of the 4.4 billion people offline worldwide are in 20 countries\nincluding the U.S., which has 50 million; 1 out of 6 people...', width / 2, letters.y + titleBottomMargin)
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

/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function(win) {
    var doc = win.document;

    // If there's a hash, or addEventListener is undefined, stop here
    if (!win.navigator.standalone && !location.hash && win.addEventListener) {

        //scroll to 1
        win.scrollTo(0, 1);
        var scrollTop = 1,
            getScrollTop = function() {
                return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
            },

            //reset to 0 on bodyready, if needed
            bodycheck = setInterval(function() {
                if (doc.body) {
                    clearInterval(bodycheck);
                    scrollTop = getScrollTop();
                    win.scrollTo(0, scrollTop === 1 ? 0 : 1);
                }
            }, 15);

        win.addEventListener("load", function() {
            setTimeout(function() {
                //at load, if user hasn't scrolled more than 20 or so...
                if (getScrollTop() < 20) {
                    //reset to hide addr bar at onload
                    win.scrollTo(0, scrollTop === 1 ? 0 : 1);
                }
            }, 0);
        }, false);
    }
})(this);
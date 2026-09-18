(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    // The front page ships in the markup as a complete, readable issue, so the
    // site works with no JavaScript and crawlers see the paper rather than an
    // empty shell. This module replaces that standing issue with the one for
    // today's date — or for ?issue=YYYY-MM-DD, if the reader came from the
    // archive.
    function textInto(selector, value) {
        const node = document.querySelector(selector);
        if (node && typeof value === 'string') node.textContent = value;
    }

    // The folio line is two units, the date and the volume, either side of
    // a middot. Each goes in its own span so that where the line has to
    // break — a phone — it breaks at the middot rather than leaving "717"
    // on a line of its own.
    function mastheadInto(selector, line) {
        const node = document.querySelector(selector);
        if (!node || typeof line !== 'string') return;
        const parts = line.split(' · ');
        if (parts.length !== 2) {
            node.textContent = line;
            return;
        }
        const separator = document.createElement('span');
        separator.className = 'masthead__sep';
        separator.textContent = ' · ';
        node.replaceChildren(
            ...parts.flatMap((part, index) => {
                const span = document.createElement('span');
                span.textContent = part;
                return index === 0 ? [span, separator] : [span];
            }),
        );
    }

    function listInto(selector, items, render) {
        const list = document.querySelector(selector);
        if (!list || !Array.isArray(items) || !items.length) return;
        list.replaceChildren(
            ...items.map((item) => {
                const li = document.createElement('li');
                render(li, item);
                return li;
            }),
        );
    }

    // The weather cut is one drawing with four switches. The forecast lines in
    // data.WEATHER all open on the sky — "Sunny", "Drizzle", "Fog" — so the
    // first word is enough to set them. Anything unrecognised gets sun and
    // cloud, which is true of most days here.
    const SKIES = {
        sun: ['sunny', 'clear', 'bright', 'hot', 'warm', 'fine'],
        cloud: ['overcast', 'cold', 'grey', 'gray', 'dull'],
        sunCloud: ['mild', 'cool', 'humid', 'unsettled', 'changeable', 'close'],
        rain: ['rain', 'drizzle', 'storms', 'snow', 'showers', 'sleet', 'wet'],
        wind: ['wind', 'windy', 'breezy', 'gusts', 'fog', 'mist', 'haze'],
    };

    function weatherLayers(line) {
        const word =
            String(line)
                .toLowerCase()
                .match(/[a-z]+/)?.[0] || '';
        const inGroup = (group) => SKIES[group].includes(word);
        if (inGroup('sun')) return { sun: 1, cloud: 0, rain: 0, wind: 0 };
        if (inGroup('cloud')) return { sun: 0, cloud: 1, rain: 0, wind: 0 };
        if (inGroup('rain')) return { sun: 0, cloud: 1, rain: 1, wind: 0 };
        if (inGroup('wind')) return { sun: 0, cloud: 1, rain: 0, wind: 1 };
        return { sun: 1, cloud: 1, rain: 0, wind: 0 };
    }

    function setWeatherCut(line) {
        const cut = document.getElementById('weather-cut');
        if (!cut || typeof line !== 'string') return;

        for (const [layer, value] of Object.entries(weatherLayers(line))) {
            cut.style.setProperty(`--${layer}`, String(value));
        }
    }

    // The town map is one drawing with a ring round each place, and the
    // desk shows the rings for the places the day's notices and letters
    // name. Each place is a switch on the svg element and a name for the
    // caption.
    const PLACES = [
        ['bridge', /Mill Street bridge/i, 'the Mill Street bridge'],
        ['orchard', /Orchard Lane/i, 'Orchard Lane'],
        ['station', /station|farmers market/i, 'the station'],
        ['depot', /depot|bandstand/i, 'Depot Park'],
        ['hall', /council|town office|town clerk|tax office/i, 'the town hall'],
        ['library', /library/i, 'the library'],
        [
            'center',
            /community center|polls|flu clinic/i,
            'the community center',
        ],
        ['gym', /\bgym\b/i, 'the gym'],
        [
            'school',
            /high school|school board|Little League/i,
            'the high school',
        ],
        ['route9', /Route 9|interchange/i, 'Route 9'],
        ['river', /\briver\b/i, 'the river'],
        ['shelter', /animal shelter/i, 'the animal shelter'],
    ];

    function placesNamed(texts) {
        const joined = texts.join('\n');
        return PLACES.filter(([, pattern]) => pattern.test(joined));
    }

    function setTownMap(issue) {
        const cut = document.getElementById('map-cut');
        if (!cut) return;
        const texts = [
            ...(issue.notices || []),
            ...(issue.letters || []).flatMap((letter) => [
                letter.body,
                letter.signature,
            ]),
        ];
        const named = placesNamed(texts);
        const on = new Set(named.map(([key]) => key));
        for (const [key] of PLACES) {
            cut.style.setProperty(`--${key}`, on.has(key) ? '1' : '0');
        }
        const caption = document.getElementById('map-caption');
        if (!caption) return;
        const list = named.map(([, , name]) => name);
        const ringed = list.length
            ? `Ringed, from today's notices and letters: ${list.join(', ')}.`
            : "Nothing in today's notices is on it, which is a quiet day.";
        caption.replaceChildren(
            Object.assign(document.createElement('b'), {
                textContent: 'CORBIN FALLS',
            }),
            ` — The river, the bridge with one lane, and Orchard Lane, where he lives at No. 12. ${ringed}`,
        );
    }

    function renderIssue(issue) {
        if (!issue) return;

        mastheadInto('#masthead-date', issue.mastheadLine);
        document.title = `The Corbin Falls Gazette · No. ${issue.number}`;

        if (issue.lead) {
            textInto('#lead-headline', issue.lead.headline);
            textInto('#lead-deck', `${issue.dateline} — ${issue.lead.deck}`);
            textInto('#lead-byline', issue.lead.byline);
        }

        const editorial = document.querySelector('#editorial');
        if (editorial) {
            editorial.hidden = !issue.editorial;
            if (issue.editorial) {
                textInto('#editorial-head', issue.editorial.head);
                const body = document.querySelector('#editorial-body');
                body?.replaceChildren(
                    ...issue.editorial.body.map((text) => {
                        const p = document.createElement('p');
                        p.textContent = text;
                        return p;
                    }),
                );
                textInto(
                    '#editorial-signature',
                    `— ${issue.editorial.signature}`,
                );
            }
        }

        listInto('#briefs-list', issue.briefs, (li, brief) => {
            li.textContent = brief;
        });

        listInto('#corrections-list', issue.corrections, (li, correction) => {
            li.textContent = correction;
        });

        listInto('#notices-list', issue.notices, (li, notice) => {
            li.textContent = notice;
        });

        textInto('#weather-numbers', issue.weatherNumbers);
        textInto('#weather-line', issue.weather);
        setWeatherCut(issue.weather);

        listInto('#classifieds-list', issue.classifieds, (li, ad) => {
            li.textContent = ad;
        });

        listInto('#letters-list', issue.letters, (li, letter) => {
            const body = document.createElement('p');
            body.className = 'letter-body';
            body.textContent = `Sir — ${letter.body}`;
            const signature = document.createElement('p');
            signature.className = 'letter-signature';
            signature.textContent = `— ${letter.signature}`;
            li.append(body, signature);
        });

        setTownMap(issue);

        if (issue.colophon) {
            textInto('#colophon-staff', issue.colophon.staff);
            textInto('#colophon-note', issue.colophon.note);
        }

        // The clipping is the issue's social card, drawn at the edge.
        const clipping = document.querySelector('#colophon-card');
        if (clipping) clipping.href = `/card.png?issue=${issue.issueParam}`;
    }

    function requestedIssueDate() {
        const requested = new URLSearchParams(window.location.search).get(
            'issue',
        );
        return Neckass.issue.parseIssueDate(requested);
    }

    function init() {
        if (!Neckass.issue || !document.querySelector('#lead-headline')) return;

        const today = Neckass.issue.composeIssue(new Date());
        const requested = requestedIssueDate();
        // A date past today is an issue that has not gone to press. The
        // entry cites a few of those ahead of time; the reader gets today's
        // paper and a line saying when the one they asked for is due.
        const isFuture =
            requested && Neckass.issue.issueNumber(requested) > today.number;
        const issue =
            requested && !isFuture
                ? Neckass.issue.composeIssue(requested)
                : today;
        renderIssue(issue);
        Neckass.currentIssue = issue;

        // Back issues say so, and offer the way back to today.
        const banner = document.querySelector('#back-issue-notice');
        if (banner) {
            const isBackIssue = issue.number !== today.number;
            banner.hidden = !(isBackIssue || isFuture);
            if (isFuture) {
                const due = Neckass.issue.composeIssue(requested);
                textInto(
                    '#back-issue-text',
                    `No. ${due.number} goes to press ${due.dateLabel}. This is today's issue.`,
                );
                banner.querySelector('a').hidden = true;
            } else if (isBackIssue) {
                textInto(
                    '#back-issue-text',
                    `You are reading No. ${issue.number}, published ${issue.dateLabel}.`,
                );
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    Neckass.frontPage = { renderIssue, init, weatherLayers, placesNamed };
})();

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

    function renderIssue(issue) {
        if (!issue) return;

        textInto('#masthead-date', issue.mastheadLine);

        if (issue.lead) {
            textInto('#lead-headline', issue.lead.headline);
            textInto('#lead-deck', `${issue.dateline} — ${issue.lead.deck}`);
            textInto('#lead-byline', issue.lead.byline);
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

        if (issue.colophon) {
            textInto('#colophon-staff', issue.colophon.staff);
            textInto('#colophon-note', issue.colophon.note);
        }
    }

    function activeIssueDate() {
        const requested = new URLSearchParams(window.location.search).get(
            'issue',
        );
        return Neckass.issue.parseIssueDate(requested) || new Date();
    }

    function init() {
        if (!Neckass.issue || !document.querySelector('#lead-headline')) return;

        const date = activeIssueDate();
        const issue = Neckass.issue.composeIssue(date);
        renderIssue(issue);
        Neckass.currentIssue = issue;

        // Back issues say so, and offer the way back to today.
        const today = Neckass.issue.composeIssue(new Date());
        const banner = document.querySelector('#back-issue-notice');
        if (banner) {
            const isBackIssue = issue.number !== today.number;
            banner.hidden = !isBackIssue;
            if (isBackIssue) {
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

    Neckass.frontPage = { renderIssue, init, weatherLayers };
})();

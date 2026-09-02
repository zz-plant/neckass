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

    function renderIssue(issue) {
        if (!issue) return;

        textInto('#masthead-date', `${issue.dateLabel} · No. ${issue.number}`);

        if (issue.lead) {
            textInto('#lead-headline', issue.lead.headline);
            textInto('#lead-deck', issue.lead.deck);
            textInto('#lead-byline', issue.lead.byline);
        }

        listInto('#briefs-list', issue.briefs, (li, brief) => {
            li.textContent = brief;
        });

        listInto('#corrections-list', issue.corrections, (li, correction) => {
            li.textContent = correction;
        });

        textInto('#weather-line', issue.weather);

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

    Neckass.frontPage = { renderIssue, init };
})();

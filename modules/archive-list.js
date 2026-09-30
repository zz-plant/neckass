(() => {
    const Neckass = window.Neckass;
    if (!Neckass?.issue) return;

    // The archive is not stored, it is derived: every past date composes its
    // own issue from the calendar, so the back catalogue is as long as the
    // paper is old and costs nothing to keep. The whole run is listed, by
    // month, each issue with its lead, so a reader can find the fridge one.
    const monthFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
    });
    const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
    });

    function issueLink(issue, isCurrent) {
        const link = document.createElement('a');
        link.href = isCurrent ? '/' : `/?issue=${issue.issueParam}`;
        return link;
    }

    function issueRow(issue, isCurrent) {
        const li = document.createElement('li');
        const link = issueLink(issue, isCurrent);
        const folio = document.createElement('span');
        folio.className = 'archive-folio';
        folio.textContent = `No. ${issue.number} · ${weekdayFormatter.format(issue.date)} ${issue.date.getDate()}`;
        const lead = document.createElement('span');
        lead.className = 'archive-lead';
        lead.textContent = issue.lead?.headline || '';
        link.append(folio, lead);
        li.append(link);
        const tag = isCurrent ? 'Current issue' : issue.tag;
        if (tag) {
            const note = document.createElement('span');
            note.className = 'archive-tag';
            note.textContent = tag;
            li.append(note);
        }
        return li;
    }

    // The landmark editions first, on their own, then the run.
    function landmarks(issues) {
        const list = document.querySelector('#archive-landmarks');
        if (!list) return;
        const written = issues.filter((issue) => issue.tag).reverse();
        if (!written.length) return;
        list.replaceChildren(
            ...written.map((issue) => {
                const li = document.createElement('li');
                const link = issueLink(issue, false);
                link.textContent = `No. ${issue.number}, ${issue.tag.toLowerCase()}`;
                li.append(link, ` — ${issue.dateLabel}.`);
                return li;
            }),
        );
        list.closest('section')?.removeAttribute('hidden');
    }

    function monthAnchor(date) {
        return `month-${Neckass.issue.toIssueParam(date).slice(0, 7)}`;
    }

    // The run is two years long and growing, so the months are indexed at
    // the top: a line per year, newest first, each month a link to its head.
    function monthIndex(months) {
        const list = document.querySelector('#archive-months');
        if (!list) return;
        const years = new Map();
        for (const [, issues] of months) {
            const { date } = issues[0];
            const year = date.getFullYear();
            if (!years.has(year)) years.set(year, []);
            years.get(year).push(date);
        }
        list.replaceChildren(
            ...[...years].map(([year, dates]) => {
                const li = document.createElement('li');
                const label = document.createElement('span');
                label.className = 'archive-year';
                label.textContent = String(year);
                li.append(
                    label,
                    ...dates.map((date) => {
                        const link = document.createElement('a');
                        link.href = `#${monthAnchor(date)}`;
                        link.textContent =
                            Neckass.issue.AP_MONTHS[date.getMonth()];
                        return link;
                    }),
                );
                return li;
            }),
        );
        list.closest('nav')?.removeAttribute('hidden');
    }

    function init() {
        const host = document.querySelector('#archive-run');
        if (!host) return;

        const issues = Neckass.issue.recentIssues();
        if (!issues.length) return;
        landmarks(issues);

        // Group by month, most recent first.
        const months = new Map();
        for (const issue of issues) {
            const key = monthFormatter.format(issue.date);
            if (!months.has(key)) months.set(key, []);
            months.get(key).push(issue);
        }

        monthIndex(months);

        host.replaceChildren(
            ...[...months].map(([month, list], monthIndex) => {
                const section = document.createElement('section');
                section.className = 'archive-month';
                section.id = monthAnchor(list[0].date);
                const head = document.createElement('h2');
                head.className = 'section-label';
                head.textContent = month;
                const ul = document.createElement('ul');
                ul.className = 'archive-list';
                ul.append(
                    ...list.map((issue, index) =>
                        issueRow(issue, monthIndex === 0 && index === 0),
                    ),
                );
                section.append(head, ul);
                return section;
            }),
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

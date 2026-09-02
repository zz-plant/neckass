(() => {
    const Neckass = window.Neckass;
    if (!Neckass?.issue) return;

    // The archive is not stored, it is derived: every past date composes its
    // own issue from the calendar, so the back catalogue is as long as the
    // paper is old and costs nothing to keep.
    const ISSUE_COUNT = 45;

    function init() {
        const list = document.querySelector('#archive-list');
        if (!list) return;

        const issues = Neckass.issue.recentIssues(ISSUE_COUNT);
        if (!issues.length) return;

        list.replaceChildren(
            ...issues.map((issue, index) => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = index === 0 ? '/' : `/?issue=${issue.issueParam}`;
                link.textContent = `No. ${issue.number} — ${issue.dateLabel}`;
                li.append(link);
                if (index === 0) {
                    const note = document.createElement('span');
                    note.textContent = ' · current issue';
                    li.append(note);
                }
                return li;
            }),
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

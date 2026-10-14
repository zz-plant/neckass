const SITE = 'https://neckass.com';

/** Metadata describes the issue's printed satire, never a real news event. */
export function issueMetadata(issue, datedLink = false) {
    const permalink = `${SITE}/?issue=${issue.issueParam}`;
    const image = `${SITE}/card.png?issue=${issue.issueParam}`;
    return {
        title: `${issue.lead.headline} | The Gazette, No. ${issue.number}`,
        description: issue.lead.deck,
        image,
        alt: `The front page of The Gazette, No. ${issue.number}: ${issue.lead.headline}`,
        canonical: datedLink ? permalink : `${SITE}/`,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${permalink}#lead`,
            url: permalink,
            mainEntityOfPage: permalink,
            headline: issue.lead.headline,
            description: issue.lead.deck,
            genre: 'Satire',
            inLanguage: 'en',
            image,
            isPartOf: { '@id': `${SITE}/#website` },
        },
    };
}

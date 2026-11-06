export const SITE = 'https://neckass.com';

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

/** The value of each <meta> tag the issue rewrites, by its name or property. */
export function metaTags({ title, description, image, alt, canonical }) {
    return {
        description,
        'og:title': title,
        'twitter:title': title,
        'og:description': description,
        'twitter:description': description,
        'og:image': image,
        'og:image:secure_url': image,
        'twitter:image': image,
        'og:image:alt': alt,
        'twitter:image:alt': alt,
        'og:url': canonical,
        'twitter:url': canonical,
    };
}

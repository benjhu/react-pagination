export const messageGroup = (warn, group, ...messages) => {
    if (group)
        console.group();

    messages.forEach(message =>
        (warn ? console.warn : console.log)(...message));

    if (group)
        console.groupEnd();
};

export const pageIsWithinBounds = (total, itemsPerPage, page) => {
    const pages = Math.ceil(total / itemsPerPage);
    return page > 0 && page <= pages;
};
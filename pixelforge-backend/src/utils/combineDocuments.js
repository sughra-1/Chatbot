export const combineDocuments = (documents) => {
    return documents.map(
            document => document.pageContent ?? document.content
        ).join('\n\n')
}
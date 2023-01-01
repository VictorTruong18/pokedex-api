import config from './../config.js';


export const paginate = (id, results, page, pageSize) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = page * pageSize
    const previous = page > 1 ? `http://localhost:${config.NODE_APP_PORT}/dresseur/${id}/pokemon?page=${page-1}&pageSize=${pageSize}` : "No page";
    const result = results.slice(startIndex, endIndex)
    // Count the number of pages it will take to show all the content depending on the page size
    const allThePages = Math.ceil(results.length / pageSize) 
    const next = page < allThePages ? `http://localhost:${config.NODE_APP_PORT}/dresseur/${id}/pokemon?page=${page+1}&pageSize=${pageSize}` : "No page";
    return {
        results: result,
        next: next,
        previous: previous
    }
}
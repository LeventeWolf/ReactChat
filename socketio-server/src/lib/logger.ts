export function log(...args) {
    const date = new Date().toTimeString();
    const f_date = date.split(' ')[0];

    console.log(`[${f_date}] ${args}`)
}
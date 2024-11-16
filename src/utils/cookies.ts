export function getCookies()
{
    return document.cookie.split(';').reduce((acc,cur)=>{
        let [key,val] = cur.split('=');
        acc.set(key,val);
        return acc;
    },new Map<string,string>());
}
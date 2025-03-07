import Redis from "ioredis";
export const redis=new Redis()

export const getCache=async<T>(key:string):Promise<T>=>{
     
    return await redis.get(key).then((data)=>{
        if(data){
            return JSON.parse(data)
        }
        return null
    })
    
}

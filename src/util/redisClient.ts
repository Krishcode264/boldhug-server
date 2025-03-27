import Redis from "ioredis";
export const redis=new Redis({
    host:process.env.REDIS_HOST||"redis",
    port:6379
})
redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis error", err));

export const getCache=async<T>(key:string):Promise<T>=>{
     
    return await redis.get(key).then((data)=>{
        if(data){
            return JSON.parse(data)
        }
        return null
    })
    
}

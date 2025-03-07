export const errReturn=(err:any,code:string)=>{
if(err as typeof Error){
    return err.message
}
return code
}
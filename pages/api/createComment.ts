// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'

const client = createClient ({
    dataset : process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x5rdv0c7",
    useCdn : true,
    token : process.env.SANITY_API_TOKEN ,
})

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {_id , email, name , comment} = JSON.parse(req.body);
    try{
       await client.create({
        _type : "comment",
        post : {
            _type : "reference",
            _ref :_id,
        },
         email,
         name,
         comment,
       });
    }catch(err){
        return res.status(5000).json({ messsage :`this message was not send` ,err})
    }
    console.log("this message send ")
  return  res.status(200).json({ message: `this message send` })
}

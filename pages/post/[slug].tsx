import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { SanityClient, urlFor } from '../../sanity'
import { Posts } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import {useForm , SubmitHandler} from 'react-hook-form'


interface Props {
  post : Posts
}

type Inputs = {
  _id : string
  name : string
  email: string
  comment: string
}


const Post = ({post} : Props) => {
  const [submitted , setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
       fetch("/api/createComment", {
        method : "POST",
        body:JSON.stringify(data)
       }).then(() => {
             setSubmitted(true)
       }).catch((err) => {
        setSubmitted(false)
       })
  }
    
  return (
    <div>
        <Header/>
        {/*mson mimage*/}
 
 <img className='w-full h-96 object-cover' src={urlFor(post.mainImage).url()!}  alt='cover_image'/>
       
  <div className='max-w-3xl mx-auto bg-gray-200  mb-10'>
      <article className='w-full  mx-auto p-5 placeholder-gray-300'>
        <h1 className='font-titleFont font-medium text-[32px] text-green-600 border-b-[1px] border-black mt-10 mb-3'>
          {post.title}
        </h1>
        <h2 className='font-bodyFont text-gray-600 mb-2'>
          {post.description}
        </h2>

      </article>
        <div className='flex gap-3 items-center'>
  <img className='w-12 h-12 object-cover bg-red-400 rounded-full' src={urlFor(post.author.image).url()!}  alt='cover_image'/>

  <p>
    <span>blog posted by {post.author.name}
    Published At {new Date(post.publishedAt).toLocaleDateString()}</span></p>
      </div>

      <div className='mt-10'>
        <PortableText dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x5rdv0c7"}
        content={post.body}
        serializers={{
          h1: (props: any) =>(
            <h1
            className='text-3xl font-bold my-5 font-titleFont text-yellow-400' {...props}/>
          ),
          h2: (props: any) =>(
            <h2
            className='text-3xl font-bold my-5 font-titleFont' {...props}/>
          ),
          h3: (props: any) =>(
            <h2
            className='text-3xl font-bold my-5 font-titleFont' {...props}/>
          ),
          li : ({children} : any) => {
            <li className='ml-4 list-disc'>{children}</li>
          },
          link : ({href , children} : any) => (
            <a href={href} className='text-cyan-500 hover:underline cursor-pointer'>
              {children}
              </a>
          ),
        }}/>

      </div>


     
  </div>
    {submitted ? (
          <div className='text-center font-[23px]'>
               <p>this message send</p>
          </div>
    ): (
      <div className='text-center'>
        <p >enjoy this articl</p><br />
        <h2>leave comment</h2>
        <hr />
        <input type='hidden'  {...register("_id", { required: true })} value={post._id}/>
        
       
        <form onSubmit={handleSubmit(onSubmit)}>
        
            <input  
             type="text" 
            placeholder='enter your name'
             {...register("name")}
            />
            <input  
            type="email"
            placeholder='enter your email'
            {...register("email", { required: true })}/>
            
            <br />
            <br />
           <textarea
           {...register("comment", { required: true })}
             placeholder='enter your comment' rows={6} />
           <button type='submit'>Submit</button>
      
       </form>
         

         <div >
         <h3>comment</h3>
         <hr />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p><span>{comment.name}:</span>{comment.comment}</p>
          </div>
        ))}

         </div>
        
          
      </div>
      )}

        <Footer/>
    </div>
  )
  
}

export default Post

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug{
          current
        },
    }`;
    const posts = await SanityClient.fetch(query)
    const paths = posts.map((post : Posts) =>({
        params : {
          slug: post.slug.current,
        },
    }));

    return {
        paths,
        fallback : "blocking",
    };
};
export const getStaticProps : GetStaticProps = async ({params}) => {

  const query = `*[_type == "post" && slug.current ==  $slug ][0]{
    _id,
      publishedAt,
      title,
      author -> {
        name,
        image 
      },
      "comments" : * [_type == "comment" && post._ref == ^._id && approved == true ],
      description,
      mainImage,
      slug,
      body
  }`
  const post = await SanityClient.fetch(query,{
    slug:params?.slug,
  })
    if (!post){
    return{
      notFound : true
    }
  }
  return {
    props: {
         post
    },

  };
  
} 

// export const getStaticProps : GetStaticProps = async ({params}) => {
//   const query = `*[_type == "post" $$ slug.current == $slug][0]{
//     _id,
//     publishedAt,
//       title,
//       author -> {
//         name,
//         image 
//       },
//       description,
//       mainImage,
//       slug,
//       body
//   }`

//   const post = await SanityClient.fetch(query,{
//     slug:params?.slug,
//   });
//   if (!post){
//     return{
//       notFound : true
//     }
//   }
//   return {
//     props: {
//          post,
//     },

//   };
// }